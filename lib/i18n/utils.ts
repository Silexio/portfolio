import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

export type Bilingual<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Narrows any string to a supported locale, falling back to the default. */
export function asLocale(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Resolves a bilingual node, falling back to the default locale. */
export function t<T>(node: Bilingual<T>, lang: Locale): T {
  return node[lang] ?? node[DEFAULT_LOCALE];
}

/** Locale codes for Intl: Belgian French and British English, the conventions this audience reads. */
export function intlLocale(lang: Locale): string {
  return lang === "fr" ? "fr-BE" : "en-GB";
}

/** Date en toutes lettres, par ex. « 21 septembre 2026 ». */
export function longDate(iso: string, lang: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Replaces each `{key}` of a template with its value; unknown keys stay visible so a gap shows up in review. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? vars[key] : `{${key}}`,
  );
}

/** Resolves every bilingual entry of a dictionary to plain strings for one locale. */
export function resolveDict<T extends Record<string, Bilingual>>(
  dict: T,
  lang: Locale,
): Record<keyof T, string> {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, t(value, lang)]),
  ) as Record<keyof T, string>;
}

/** Narrows the route param to a supported locale, falling back to the default. */
export async function localeParam(
  params: Promise<{ lang: string }>,
): Promise<Locale> {
  const { lang } = await params;
  return asLocale(lang);
}
