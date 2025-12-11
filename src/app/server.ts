import { serve } from "@hono/node-server";
import { app } from "@/app/app";
import env from "@/config/env";
import { registerProcessHandlers } from "@/app/lifecycle";
import { baseLogger } from "@/lib/logger";

const port = env.PORT;
const baseUrl = env.BASE_URL;

console.log(`
🚀 Server starting...
   Environment: ${env.NODE_ENV}
   Port: ${port}
   Base URL: ${baseUrl}/api/v1
   
📱 For Expo development, use: ${baseUrl}/api/v1
🌐 For Next.js development, use: http://localhost:${port}/api/v1

✅ Server running at ${baseUrl}/api/v1
`);

const server = serve({ fetch: app.fetch, port });

async function shutdown(options?: { exitCode?: number }) {
   const exitCode = options?.exitCode ?? 0;

   baseLogger.info(
      {
         port,
         baseUrl,
         node: process.version,
      },
      "HTTP server listening"
   );


   try {
      if ("close" in server && typeof server.close === "function") {
         server.close();
      }

      baseLogger.info("Shutdown cleanup complete");

      if (env.NODE_ENV !== "development") {
         baseLogger.info({ exitCode }, "Exiting process");
         process.exit(exitCode);
      } else {
         baseLogger.info("Dev mode detected — letting watcher restart the process");
      }
   } catch (err) {
      baseLogger.error({ err }, "Error during shutdown");

      if (env.NODE_ENV !== "development") {
         process.exit(1);
      }
   }
}

registerProcessHandlers(shutdown);
