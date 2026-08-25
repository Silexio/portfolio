import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // Les visuels sont déjà servis en WebP à la bonne taille. L'optimiseur /_next/image dépend de
  // Cloudflare Images sur Workers, qu'on ne provisionne pas : il renverrait l'original en payant
  // une requête Worker de plus, et rouvrirait une surface d'attaque (CVE-2025-55173/57752).
  images: { unoptimized: true },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [{ source: "/", destination: "/fr", permanent: true }];
  },
};

// Binds the wrangler.jsonc resources (D1, env) into `next dev`, so the booking flow works locally.
initOpenNextCloudflareForDev();

// Bugsink (self-hosted, Sentry protocol). Pas de tunnelRoute : le rewrite qu'il génère pointe en dur
// sur ingest.sentry.io. Le relais same-origin est app/monitoring/route.ts, ciblé par le `tunnel`
// explicite de instrumentation-client.ts. Source maps uploadées seulement si un token est fourni.
export default withSentryConfig(nextConfig, {
  sentryUrl: process.env.SENTRY_URL,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
