import type { Metadata } from "next";
import { LEGAL } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://silexio.be";

/**
 * Bloc Open Graph complet d'une page. Next fusionne les métadonnées clé par clé sans descendre
 * dans les objets : une page qui redéfinit `openGraph` perd tout ce que le layout y mettait,
 * d'où ce constructeur partagé plutôt qu'une surcharge partielle.
 */
export function openGraph(
  lang: Locale,
  path: string,
  title: string,
  description: string,
): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    url: path,
    siteName: LEGAL.entity,
    title,
    description,
    locale: lang === "fr" ? "fr_BE" : "en_US",
    alternateLocale: lang === "fr" ? "en_US" : "fr_BE",
    images: [{ url: "/opengraph.png", width: 1200, height: 630, alt: title }],
  };
}
