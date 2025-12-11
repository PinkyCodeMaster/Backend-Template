import { baseLogger } from "@/lib/logger";
import { Sentry } from "@/lib/sentry";
import env from "@/config/env";

type ShutdownFn = (options?: { exitCode?: number }) => Promise<void> | void;

export function registerProcessHandlers(shutdown: ShutdownFn) {
  process.on("unhandledRejection", (reason) => {
    baseLogger.error({ reason }, "Unhandled promise rejection");
    if (env.SENTRY_DSN) {
      Sentry.captureException(reason);
    }
    shutdown({ exitCode: 1 });
  });

  process.on("uncaughtException", (error) => {
    baseLogger.error({ error }, "Uncaught exception");
    if (env.SENTRY_DSN) {
      Sentry.captureException(error);
    }
    shutdown({ exitCode: 1 });
  });

  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

  for (const signal of signals) {
    process.on(signal, () => {
      baseLogger.info({ signal }, "Received shutdown signal");
      shutdown({ exitCode: 0 });
    });
  }
}
