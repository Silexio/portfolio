import { envelopeTarget } from "@/lib/observability/dsn";

export const dynamic = "force-dynamic";

const MAX_ENVELOPE_BYTES = 1_000_000;

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

  const envelope = await request.arrayBuffer();
  if (envelope.byteLength > MAX_ENVELOPE_BYTES)
    return new Response(null, { status: 413 });

  try {
    const upstream = await fetch(target.url, {
      method: "POST",
      headers: { "Content-Type": "application/x-sentry-envelope" },
      body: envelope,
    });
    return new Response(null, { status: upstream.ok ? 202 : 502 });
  } catch {
    return new Response(null, { status: 502 });
  }
}
