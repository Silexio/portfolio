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

/** Resolves every bilingual entry of a dictionary to plain strings for one locale. */
export function resolveDict<T extends Record<string, Bilingual>>(dict: T, lang: Locale): Record<keyof T, string> {
  return Object.fromEntries(Object.entries(dict).map(([key, value]) => [key, t(value, lang)])) as Record<
    keyof T,
    string
  >;
}

/** Narrows the route param to a supported locale, falling back to the default. */
export async function localeParam(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return asLocale(lang);
}
