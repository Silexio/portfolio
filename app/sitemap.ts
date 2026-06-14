import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { BASE_URL } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((lang) => [lang, `${BASE_URL}/${lang}`]));
  return LOCALES.map((lang) => ({
    url: `${BASE_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
