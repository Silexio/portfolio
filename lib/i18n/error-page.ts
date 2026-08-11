import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";
import type { Bilingual } from "@/lib/i18n/utils";

/**
 * Copy for the root error boundary. Deliberately kept out of lib/data.ts: global-error is a client
 * component, so importing the full dictionary there would ship it to every visitor.
 */
export const ERROR_PAGE: Record<"title" | "body" | "retry" | "home", Bilingual> = {
  title: { fr: "Quelque chose a cassé.", en: "Something broke." },
  body: {
    fr: "L'incident est remonté automatiquement. Réessayez, ou écrivez-moi si ça persiste.",
    en: "The incident was reported automatically. Try again, or email me if it persists.",
  },
  retry: { fr: "Réessayer", en: "Try again" },
  home: { fr: "Retour à l'accueil", en: "Back home" },
};

/** Best-effort locale from the browser — global-error renders outside the [lang] segment. */
export function browserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const tag = navigator.language.slice(0, 2).toLowerCase();
  return (LOCALES as readonly string[]).includes(tag) ? (tag as Locale) : DEFAULT_LOCALE;
}
