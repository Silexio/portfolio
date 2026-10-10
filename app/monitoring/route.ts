import { envelopeTarget } from "@/lib/observability/dsn";

export const dynamic = "force-dynamic";

const MAX_ENVELOPE_BYTES = 1_000_000;
/** Un Bugsink lent ne doit pas retenir le Worker du visiteur. */
const UPSTREAM_TIMEOUT_MS = 4000;

/**
 * Same-origin relay for browser error events, so connect-src stays 'self' and ad blockers
 * can't drop them. Sentry's own tunnelRoute hardcodes ingest.sentry.io, so it can't reach a
 * self-hosted Bugsink — this replaces it.
 */
export async function POST(request: Request) {
  const target = envelopeTarget(
    process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  );
  if (!target) return new Response(null, { status: 404 });

  // Le plafond se lit d'abord dans l'en-tête : attendre `arrayBuffer()` pour le découvrir, c'est
  // avoir déjà tout chargé en mémoire.
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_ENVELOPE_BYTES)
    return new Response(null, { status: 413 });

  const envelope = await request.arrayBuffer();
  if (envelope.byteLength > MAX_ENVELOPE_BYTES)
    return new Response(null, { status: 413 });

  try {
    const upstream = await fetch(target.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        // L'authentification du protocole Sentry. Sans elle, le serveur répond 403 et l'erreur
        // est perdue — le navigateur n'a aucun moyen de l'apprendre.
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${target.publicKey}, sentry_client=silexio-reporter/1.0`,
        // L'authentification du protocole Sentry. Sans elle, le serveur répond 403 et l'erreur
        // est perdue — le navigateur n'a aucun moyen de l'apprendre.
      },
      body: envelope,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!upstream.ok)
      console.error(`[monitoring] Bugsink a refusé (HTTP ${upstream.status})`);
    return new Response(null, { status: upstream.ok ? 202 : 502 });
  } catch (error) {
    // Pas de Sentry ici : la cible est justement ce qui ne répond pas. Workers Logs seulement.
    console.error("[monitoring] relais injoignable", error);
    return new Response(null, { status: 502 });
  }
}
