import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { BASE_URL } from "@/lib/metadata";
import { SERVICE_PAGES, servicePath } from "@/lib/services";

const PATHS = [
  { path: "", priority: 1 as const, changeFrequency: "monthly" as const },
  {
    path: "/legal",
    priority: 0.3 as const,
    changeFrequency: "yearly" as const,
  },
];

/* Les pages dédiées ont un slug par langue : leurs alternates ne se déduisent pas d'un suffixe commun. */
function servicePages(): MetadataRoute.Sitemap {
  return SERVICE_PAGES.flatMap((page) => {
    const languages = Object.fromEntries(
      LOCALES.map((lang) => [lang, `${BASE_URL}${servicePath(page, lang)}`]),
    );
    return LOCALES.map((lang) => ({
      url: `${BASE_URL}${servicePath(page, lang)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages },
    }));
  });
}

/* Pas de `lastModified` : `new Date()` au build daterait chaque URL du dernier déploiement, même
   celles qui n'ont pas changé. Google ignore un lastmod toujours faux — autant ne rien annoncer. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PATHS.flatMap(({ path, priority, changeFrequency }) => {
    const languages = Object.fromEntries(
      LOCALES.map((lang) => [lang, `${BASE_URL}/${lang}${path}`]),
    );
    return LOCALES.map((lang) => ({
      url: `${BASE_URL}/${lang}${path}`,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
  return [...pages, ...servicePages()];
}
