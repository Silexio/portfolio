import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { BASE_URL } from "@/lib/metadata";

const PATHS = [
  { path: "", priority: 1 as const, changeFrequency: "monthly" as const },
  { path: "/legal", priority: 0.3 as const, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PATHS.flatMap(({ path, priority, changeFrequency }) => {
    const languages = Object.fromEntries(LOCALES.map((lang) => [lang, `${BASE_URL}/${lang}${path}`]));
    return LOCALES.map((lang) => ({
      url: `${BASE_URL}/${lang}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
