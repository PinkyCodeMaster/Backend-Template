import { baseLogger } from "@/lib/logger";

type ShutdownFn = (options?: { exitCode?: number }) => Promise<void> | void;

export function registerProcessHandlers(shutdown: ShutdownFn) {
  process.on("unhandledRejection", (reason) => {
    baseLogger.error({ reason }, "Unhandled promise rejection");
    shutdown({ exitCode: 1 });
  });

  process.on("uncaughtException", (error) => {
    baseLogger.error({ error }, "Uncaught exception");
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
