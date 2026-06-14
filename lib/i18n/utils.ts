import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

export type Bilingual<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Resolves a bilingual node, falling back to the default locale. */
export function t<T>(node: Bilingual<T>, lang: Locale): T {
  return node[lang] ?? node[DEFAULT_LOCALE];
}

/** Narrows the route param to a supported locale, falling back to the default. */
export async function localeParam(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}
