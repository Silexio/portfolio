import * as Sentry from "@sentry/nextjs";

// Bugsink only ingests error events: sending traces would be dropped on arrival.
// sendDefaultPii stays off — booking payloads carry prospect names, emails and phone numbers.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    environment: process.env.NODE_ENV,
  });
}
