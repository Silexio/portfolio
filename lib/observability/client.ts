import { buildEnvelope, reportKey } from "@/lib/observability/report";

/**
 * Remontée d'erreurs navigateur, écrite à la main plutôt qu'avec @sentry/nextjs : le SDK coûte
 * ~30 % du JS de la page, ce que Lighthouse facture sur le LCP mobile. Ce module en fait le strict
 * nécessaire — une enveloppe Sentry v7 POSTée sur le relais same-origin app/monitoring/route.ts.
 * Ce qui est gardé, ce qui est perdu et pourquoi : § Observabilité de CLAUDE.md.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

/* Un plantage en boucle ne doit ni noyer Bugsink ni saturer le réseau du visiteur. */
const MAX_REPORTS_PER_PAGE = 8;
const seen = new Set<string>();

/** Sends one browser error to Bugsink. No-op without a DSN, deduplicated within the page view. */
export function reportClientError(thrown: unknown) {
  if (!dsn || thrown == null || seen.size >= MAX_REPORTS_PER_PAGE) return;
  const key = reportKey(thrown);
  if (seen.has(key)) return;
  seen.add(key);

  const envelope = buildEnvelope(thrown, {
    eventId: crypto.randomUUID().replaceAll("-", ""),
    timestamp: Date.now(),
    url: location.href,
    environment: process.env.NODE_ENV,
    userAgent: navigator.userAgent,
  });

  // keepalive : l'envoi doit survivre à une navigation déclenchée juste après l'erreur.
  void fetch("/monitoring", {
    method: "POST",
    body: envelope,
    keepalive: true,
    headers: { "Content-Type": "application/x-sentry-envelope" },
  }).catch(() => {
    /* un échec d'envoi ne doit jamais déclencher une seconde erreur */
  });
}

/** Wires the two global hooks. Called once, from instrumentation-client.ts. */
export function installClientErrorReporting() {
  if (!dsn) return;
  window.addEventListener("error", (event) =>
    reportClientError(event.error ?? event.message),
  );
  window.addEventListener("unhandledrejection", (event) =>
    reportClientError(event.reason),
  );
}
