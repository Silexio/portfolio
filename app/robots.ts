import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/metadata";

/* Politique rapatriée du robots.txt managé de Cloudflare, qui préfixait le fichier d'une directive
   `Content-Signal:` invalide aux yeux de Lighthouse. Le toggle Cloudflare (AI Crawl Control →
   robots.txt managé) doit rester off, sinon son bloc revient se préfixer à celui-ci. */
const AI_CRAWLERS = [
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ClaudeBot",
  "CloudflareBrowserRenderingCrawler",
  "Google-Extended",
  "GPTBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/fr/booking/", "/en/booking/"],
      },
      { userAgent: AI_CRAWLERS, disallow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
