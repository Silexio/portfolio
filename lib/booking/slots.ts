import { BOOKING } from "@/lib/data";

const DAY_MS = 86_400_000;
const MIN_MS = 60_000;

type TzParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function partsInTz(date: Date, timeZone: string): TzParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) map[part.type] = part.value;
  const hour = map.hour === "24" ? 0 : Number(map.hour);
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

function tzOffsetMs(date: Date, timeZone: string): number {
  const p = partsInTz(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - date.getTime();
}

/** UTC instant for a wall-clock time expressed in `timeZone`, correct across DST boundaries. */
export function zonedWallToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = tzOffsetMs(new Date(guess), timeZone);
  let utc = guess - offset;
  const refined = tzOffsetMs(new Date(utc), timeZone);
  if (refined !== offset) utc = guess - refined;
  return new Date(utc);
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Bookable slot starts (ISO UTC) within the configured horizon, business days and hours
 * in Brussels time, excluding anything earlier than now + lead time. Pure: depends only on `now`.
 */
export function listSlotStarts(now: Date): string[] {
  const tz = BOOKING.timezone;
  const earliest = now.getTime() + BOOKING.leadMinutes * MIN_MS;
  const horizonEnd = now.getTime() + BOOKING.horizonDays * DAY_MS;
  const today = partsInTz(now, tz);
  const workdays = BOOKING.workdays as readonly number[];
  const out: string[] = [];

  for (let offset = 0; offset <= BOOKING.horizonDays; offset++) {
    const cursor = new Date(Date.UTC(today.year, today.month - 1, today.day + offset, 12));
    if (!workdays.includes(cursor.getUTCDay())) continue;
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth() + 1;
    const day = cursor.getUTCDate();

    for (let hour = BOOKING.startHour; hour < BOOKING.endHour; hour++) {
      for (let minute = 0; minute < 60; minute += BOOKING.slotMinutes) {
        const start = zonedWallToUtc(year, month, day, hour, minute, tz).getTime();
        if (start < earliest || start > horizonEnd) continue;
        out.push(new Date(start).toISOString());
      }
    }
  }
  return out;
}

/** Groups slot starts by their Brussels calendar day (YYYY-MM-DD), preserving order. */
export function groupByDay(starts: string[], timeZone: string = BOOKING.timezone): { day: string; starts: string[] }[] {
  const byDay = new Map<string, string[]>();
  for (const iso of starts) {
    const p = partsInTz(new Date(iso), timeZone);
    const key = `${p.year}-${pad(p.month)}-${pad(p.day)}`;
    const bucket = byDay.get(key);
    if (bucket) bucket.push(iso);
    else byDay.set(key, [iso]);
  }
  return [...byDay.entries()].map(([day, slots]) => ({ day, starts: slots }));
}

/** True when `iso` is a valid bookable slot start relative to `now` (server-side guard). */
export function isValidSlot(iso: string, now: Date): boolean {
  return listSlotStarts(now).includes(iso);
}
