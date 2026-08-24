import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // Cible le relais same-origin app/monitoring/route.ts. Le tunnelRoute de @sentry/nextjs ne
    // convient pas : son rewrite pointe en dur sur ingest.sentry.io. Sans ce tunnel explicite, le
    // SDK repart sur le host du DSN et connect-src 'self' le bloque — en silence total.
    tunnel: "/monitoring",
    tracesSampleRate: 0,
    sendDefaultPii: false,
    environment: process.env.NODE_ENV,
  });
}

/** Required by the App Router SDK: without it a client error carries no originating-route context. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
