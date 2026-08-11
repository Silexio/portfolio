import * as Sentry from "@sentry/nextjs";

/** Boots server-side error reporting and warns about env vars whose absence silently disables a feature. */
export async function register() {
  const degradesSilently = [
    "SENTRY_DSN",
    "NEXT_PUBLIC_SENTRY_DSN",
    "TURNSTILE_SECRET_KEY",
    "BREVO_API_KEY",
    "BREVO_SENDER_EMAIL",
    "BOOKING_NOTIFY_EMAIL",
    "BOOKING_ACTION_SECRET",
    "IP_HASH_SECRET",
  ].filter((key) => !process.env[key]);

  if (degradesSilently.length > 0) {
    console.warn(`[instrumentation] Missing env, related feature disabled: ${degradesSilently.join(", ")}`);
  }

  await import("./sentry.server.config");
}

export const onRequestError = Sentry.captureRequestError;
