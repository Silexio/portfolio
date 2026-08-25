export type EnvelopeTarget = {
  url: string;
};

/**
 * Resolves the Bugsink envelope endpoint from a Sentry DSN.
 * Returns null when the DSN is missing or malformed, so callers can degrade to a no-op.
 */
export function envelopeTarget(dsn: string | undefined): EnvelopeTarget | null {
  if (!dsn) return null;
  let parsed: URL;
  try {
    parsed = new URL(dsn);
  } catch {
    return null;
  }
  const projectId = parsed.pathname.split("/").filter(Boolean).pop();
  if (!projectId) return null;
  return {
    url: `${parsed.protocol}//${parsed.host}/api/${projectId}/envelope/`,
  };
}
