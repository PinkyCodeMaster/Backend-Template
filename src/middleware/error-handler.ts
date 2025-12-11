import { baseLogger } from "@/lib/logger";
import * as Sentry from "@sentry/node";
import type { Context } from "hono";
import env from "@/config/env";

export function globalErrorHandler(err: unknown, c: Context) {
  baseLogger.error({ err }, "Unhandled error");

  if (env.NODE_ENV === "production") {
    Sentry.captureException(err);
  };

  // Safe public message
  const message =
    env.NODE_ENV === "production"
      ? "Something went wrong"
      : err instanceof Error
        ? err.message
        : "Unknown error";

  return c.json(
    {
      error: message,
    },
    500
  );
}
