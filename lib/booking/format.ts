import { BOOKING } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { intlLocale } from "@/lib/i18n/utils";

/** Full slot label in Brussels time, e.g. "mardi 14 janvier, 08:00". */
export function formatSlotLabel(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: BOOKING.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Short day label in Brussels time, e.g. "mar. 14 janv.". */
export function formatDayLabel(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: BOOKING.timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

/** Time-of-day label in Brussels time, e.g. "08:30". */
export function formatTimeLabel(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: BOOKING.timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Demi-journée d'un créneau en heure de Bruxelles : la grille se lit en deux blocs, pas en dix-sept boutons. */
export function slotPeriod(iso: string): "morning" | "afternoon" {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING.timezone,
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
  return Number(hour) < 12 ? "morning" : "afternoon";
}
