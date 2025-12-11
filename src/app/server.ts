import { serve } from "@hono/node-server";
import { app } from "@/app/app";
import env from "@/config/env";
import { registerProcessHandlers } from "@/app/lifecycle";
import { baseLogger } from "@/lib/logger";

const port = env.PORT;
const baseUrl = env.BASE_URL;

baseLogger.info(
  {
    environment: env.NODE_ENV,
    port,
    baseUrl,
  },
  "Starting HTTP server",
);

const server = serve({ fetch: app.fetch, port });

baseLogger.info(
  {
    routesBase: "/api/v1",
    docs: `${baseUrl}/docs`,
  },
  `Server running at ${baseUrl}/api/v1`,
);

async function shutdown(options?: { exitCode?: number }) {
  const exitCode = options?.exitCode ?? 0;

  try {
    if ("close" in server && typeof server.close === "function") {
      server.close();
    }

    baseLogger.info("Shutdown cleanup complete");

    if (env.NODE_ENV !== "development") {
      baseLogger.info({ exitCode }, "Exiting process");
      process.exit(exitCode);
    } else {
      baseLogger.info(
        "Development mode detected; letting the watcher restart the process",
      );
    }
  } catch (err) {
    baseLogger.error({ err }, "Error during shutdown");

    if (env.NODE_ENV !== "development") {
      process.exit(1);
    }
  }
}

registerProcessHandlers(shutdown);
