import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    environment: process.env.NODE_ENV,
  });
}

/** Required by the App Router SDK: without it a client error carries no originating-route context. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
