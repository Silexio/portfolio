import { BOOKING } from "@/lib/data";
import { zonedWallToUtc } from "@/lib/booking/slots";

/** Plage occupée, en millisecondes epoch. `end` est exclusive. */
export type BusyInterval = { start: number; end: number };

const DAY_MS = 86_400_000;
const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const;
/** Garde-fou : une RRULE sans COUNT ni UNTIL est infinie, on borne l'expansion. */
const MAX_OCCURRENCES = 400;

type Prop = { name: string; params: Record<string, string>; value: string };

/**
 * Reconstitue les lignes repliées (RFC 5545 §3.1) : une ligne qui commence par un espace
 * ou une tabulation prolonge la précédente. Sans ce dépliage, une URL ou un TZID coupé
 * en deux produit une date invalide silencieusement.
 */
function unfold(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
    if ((raw.startsWith(" ") || raw.startsWith("\t")) && out.length > 0) {
      out[out.length - 1] += raw.slice(1);
    } else {
      out.push(raw);
    }
  }
  return out;
}

function parseLine(line: string): Prop | null {
  const colon = line.indexOf(":");
  if (colon === -1) return null;
  const head = line.slice(0, colon);
  const [name, ...rest] = head.split(";");
  const params: Record<string, string> = {};
  for (const part of rest) {
    const eq = part.indexOf("=");
    if (eq !== -1) params[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1).replace(/^"|"$/g, "");
  }
  return { name: name.toUpperCase(), params, value: line.slice(colon + 1).trim() };
}

/** Une date ICS : `…Z` (UTC), `TZID=…` (heure murale), ou `VALUE=DATE` (journée entière). */
function parseIcsDate(prop: Prop, fallbackTz: string): { ms: number; allDay: boolean } | null {
  const v = prop.value;
  const date = /^(\d{4})(\d{2})(\d{2})$/.exec(v);
  if (date) {
    const [, y, m, d] = date;
    return { ms: zonedWallToUtc(+y, +m, +d, 0, 0, fallbackTz).getTime(), allDay: true };
  }
  const dt = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(v);
  if (!dt) return null;
  const [, y, m, d, hh, mm, ss, zulu] = dt;
  if (zulu) return { ms: Date.UTC(+y, +m - 1, +d, +hh, +mm, +ss), allDay: false };
  const tz = prop.params.TZID || fallbackTz;
  return { ms: zonedWallToUtc(+y, +m, +d, +hh, +mm, tz).getTime(), allDay: false };
}

/** `PT1H30M`, `P1D`… — suffisant pour les DURATION qu'émettent les agendas courants. */
function parseDuration(value: string): number {
  const m = /^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(value.trim());
  if (!m) return 0;
  const at = (index: number) => Number(m[index] ?? 0);
  return (at(1) * 7 + at(2)) * DAY_MS + at(3) * 3_600_000 + at(4) * 60_000 + at(5) * 1000;
}

function parseRrule(value: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of value.split(";")) {
    const eq = part.indexOf("=");
    if (eq !== -1) out[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1);
  }
  return out;
}

/**
 * Déroule une règle de récurrence sur la fenêtre demandée. Couvre FREQ DAILY/WEEKLY/MONTHLY/YEARLY
 * avec INTERVAL, COUNT, UNTIL et BYDAY — ce qu'écrivent les agendas grand public. Les formes rares
 * (BYSETPOS, BYMONTHDAY multiple) ne sont pas dépliées : l'occurrence de base reste bloquée.
 */
function expand(startMs: number, rule: Record<string, string>, windowEnd: number): number[] {
  const freq = (rule.FREQ || "").toUpperCase();
  const interval = Math.max(1, Number(rule.INTERVAL || 1));
  const count = rule.COUNT ? Number(rule.COUNT) : Infinity;
  const until = rule.UNTIL ? parseIcsDate({ name: "UNTIL", params: {}, value: rule.UNTIL }, "UTC")?.ms ?? Infinity : Infinity;
  const byDay = rule.BYDAY ? rule.BYDAY.split(",").map((d) => d.trim().slice(-2).toUpperCase()) : null;

  const out: number[] = [];
  const cursor = new Date(startMs);
  const anchorWeek = weekStart(startMs);
  let emitted = 0;

  for (let i = 0; i < MAX_OCCURRENCES && emitted < count; i++) {
    const ms = cursor.getTime();
    if (ms > windowEnd || ms > until) break;

    // Avec BYDAY on avance d'un jour à la fois pour couvrir chaque jour listé : l'intervalle
    // ne peut alors plus vivre dans le pas, il se compte en semaines écoulées.
    const onListedDay = !byDay || byDay.includes(WEEKDAYS[cursor.getUTCDay()]);
    const onCountedWeek =
      !byDay || freq !== "WEEKLY" || ((weekStart(ms) - anchorWeek) / (7 * DAY_MS)) % interval === 0;
    if (onListedDay && onCountedWeek) {
      out.push(ms);
      emitted++;
    }

    if (freq === "DAILY") cursor.setUTCDate(cursor.getUTCDate() + interval);
    else if (freq === "WEEKLY") cursor.setUTCDate(cursor.getUTCDate() + (byDay ? 1 : 7 * interval));
    else if (freq === "MONTHLY") cursor.setUTCMonth(cursor.getUTCMonth() + interval);
    else if (freq === "YEARLY") cursor.setUTCFullYear(cursor.getUTCFullYear() + interval);
    else break;
  }
  return out;
}

/** Dimanche 00:00 UTC de la semaine contenant `ms` — repère stable pour compter les semaines. */
function weekStart(ms: number): number {
  const d = new Date(ms);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.getTime();
}

/**
 * Extrait du contenu iCalendar les plages qui rendent indisponible, limitées à la fenêtre donnée.
 * Ignore ce qui ne bloque pas : événements annulés et événements marqués « disponible »
 * (TRANSP:TRANSPARENT), que les agendas utilisent pour les rappels et anniversaires.
 */
export function parseBusyIntervals(ics: string, windowStart: Date, windowEnd: Date): BusyInterval[] {
  const tz = BOOKING.timezone;
  const from = windowStart.getTime();
  const to = windowEnd.getTime();
  const out: BusyInterval[] = [];
  let current: Prop[] | null = null;

  for (const line of unfold(ics)) {
    if (line.startsWith("BEGIN:VEVENT")) current = [];
    else if (line.startsWith("END:VEVENT")) {
      if (current) out.push(...eventToIntervals(current, tz, from, to));
      current = null;
    } else if (current) {
      const prop = parseLine(line);
      if (prop) current.push(prop);
    }
  }
  return out.sort((a, b) => a.start - b.start);
}

function eventToIntervals(props: Prop[], tz: string, from: number, to: number): BusyInterval[] {
  const find = (name: string) => props.find((p) => p.name === name);
  if (find("STATUS")?.value.toUpperCase() === "CANCELLED") return [];
  if (find("TRANSP")?.value.toUpperCase() === "TRANSPARENT") return [];

  const startProp = find("DTSTART");
  if (!startProp) return [];
  const start = parseIcsDate(startProp, tz);
  if (!start) return [];

  const endProp = find("DTEND");
  const durationProp = find("DURATION");
  let length: number;
  if (endProp) {
    const end = parseIcsDate(endProp, tz);
    length = end ? end.ms - start.ms : DAY_MS;
  } else if (durationProp) {
    length = parseDuration(durationProp.value);
  } else {
    length = start.allDay ? DAY_MS : 0;
  }
  if (length <= 0) return [];

  const excluded = new Set<number>();
  for (const ex of props.filter((p) => p.name === "EXDATE")) {
    for (const piece of ex.value.split(",")) {
      const d = parseIcsDate({ ...ex, value: piece.trim() }, tz);
      if (d) excluded.add(d.ms);
    }
  }

  const rrule = find("RRULE");
  const starts = rrule ? expand(start.ms, parseRrule(rrule.value), to) : [start.ms];

  return starts
    .filter((ms) => !excluded.has(ms))
    .map((ms) => ({ start: ms, end: ms + length }))
    .filter((iv) => iv.end > from && iv.start < to);
}

/** Vrai si le créneau chevauche une plage occupée, ne serait-ce que d'une minute. */
export function isSlotBusy(slotStartIso: string, slotMinutes: number, busy: BusyInterval[]): boolean {
  const start = Date.parse(slotStartIso);
  const end = start + slotMinutes * 60_000;
  return busy.some((iv) => iv.start < end && iv.end > start);
}
