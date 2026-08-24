import { parseBusyIntervals, type BusyInterval } from "@/lib/booking/ical";

/** Au-delà, on rend la main : un agenda lent ne doit pas retarder l'ouverture de la modale. */
const FETCH_TIMEOUT_MS = 4000;
/** Un agenda de 3 semaines pèse quelques dizaines de Ko ; au-delà c'est une URL qui ne va pas. */
const MAX_BYTES = 2_000_000;
/**
 * Sans cache, chaque ouverture de modale paie un aller-retour vers l'agenda distant
 * (~100 ms mesurés) et le service tiers encaisse une requête par visiteur. Deux minutes
 * suffisent : un créneau qu'on vient de bloquer n'est jamais réservé dans la minute,
 * et l'insert en base reste le garde-fou dur contre le double-booking.
 */
const CACHE_TTL_MS = 120_000;

/** Réponses brutes en mémoire du module — partagé par les requêtes d'une même isolate. */
const cache = new Map<string, { at: number; text: string }>();

/**
 * En-tête Basic sûr quel que soit le mot de passe : `btoa` ne prend que du Latin-1 et lève
 * sur un caractère accentué, ce qui ferait échouer la synchro sans message clair.
 */
function basicAuth(credentials: string): string {
  const bytes = new TextEncoder().encode(credentials);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `Basic ${btoa(binary)}`;
}

/**
 * Plages occupées lues sur les agendas publiés en iCalendar (`BOOKING_CALENDAR_ICS_URL`,
 * plusieurs URLs séparées par des virgules).
 *
 * `BOOKING_CALENDAR_AUTH` (`identifiant:mot-de-passe-application`) permet d'interroger un
 * agenda **non partagé publiquement** : c'est le mode à privilégier, une URL de partage
 * public étant lisible par quiconque la détient. Chez Infomaniak, générer un mot de passe
 * d'application dédié plutôt que d'employer celui du compte — il se révoque seul.
 *
 * Dégradation volontairement ouverte : agenda injoignable, refusé ou illisible → aucune plage
 * remontée, donc tous les créneaux restent réservables. Fermer à la place bloquerait toute
 * prise de rendez-vous sur une panne tierce ; le pire cas ici est une demande à refuser,
 * ce que le flux de confirmation permet déjà.
 */
export async function listBusyIntervals(windowStart: Date, windowEnd: Date): Promise<BusyInterval[]> {
  const urls = (process.env.BOOKING_CALENDAR_ICS_URL ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  if (urls.length === 0) return [];

  const credentials = process.env.BOOKING_CALENDAR_AUTH?.trim();
  const results = await Promise.all(urls.map((url) => fetchIntervals(url, credentials, windowStart, windowEnd)));
  return results.flat().sort((a, b) => a.start - b.start);
}

async function fetchIntervals(
  url: string,
  credentials: string | undefined,
  windowStart: Date,
  windowEnd: Date,
): Promise<BusyInterval[]> {
  try {
    const headers: Record<string, string> = { Accept: "text/calendar, text/plain" };
    if (credentials) headers.Authorization = basicAuth(credentials);

    const fresh = cache.get(url);
    if (fresh && Date.now() - fresh.at < CACHE_TTL_MS) {
      return parseBusyIntervals(fresh.text, windowStart, windowEnd);
    }

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), cache: "no-store" });
    if (!res.ok) return [];
    const text = await res.text();
    if (text.length > MAX_BYTES || !text.includes("BEGIN:VCALENDAR")) return [];

    // Seuls les succès sont mémorisés : un échec doit pouvoir se rétablir au coup suivant.
    cache.set(url, { at: Date.now(), text });
    return parseBusyIntervals(text, windowStart, windowEnd);
  } catch {
    return [];
  }
}
