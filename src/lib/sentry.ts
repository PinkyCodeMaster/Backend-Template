import * as Sentry from "@sentry/node";
import env from "@/config/env";

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENV,
    release: env.SENTRY_RELEASE,
    tracesSampleRate: env.NODE_ENV === "production" ? 0.2 : 1.0,
    integrations: [],
  });

  console.log("Sentry initialized");
} else {
  console.log("Sentry disabled (no DSN provided)");
}

export { Sentry };
