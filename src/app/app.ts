import { corsMiddleware, securityHeaders } from "@/middleware/security";
import { globalErrorHandler } from "@/middleware/error-handler";
import { printMetrics, registerMetrics } from "@/lib/metrics";
import { requestLogger } from "@/middleware/request-logger";
import { sentryMiddleware } from "@/middleware/sentry";
import { OpenAPIHono } from "@hono/zod-openapi";
import { authentication } from "@/routes/auth";
import { rateLimit } from "@/lib/rate-limit";
import { health } from "@/routes/health";
import env from "@/config/env";

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          ok: false,
          errors: result.error.flatten(),
        },
        422
      );
    }
  },
});

app.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
});

app.use("*", sentryMiddleware);
app.use("*", registerMetrics);
app.use(requestLogger());
app.use(
  "*",
  rateLimit({
    windowSeconds: 60,   // 1-minute window
    maxRequests: 60,     // 60 reqs per IP per minute
    keyPrefix: "rl:global",
  })
);
app.use(corsMiddleware);
app.use(securityHeaders);

app.use("*", async (c, next) => {
  const expoOrigin = c.req.header("expo-origin");
  if (expoOrigin) {
    c.req.raw.headers.set("Origin", expoOrigin);
  }
  return next();
});

app.onError(globalErrorHandler);

app.notFound((c) => {
  const req = c.req;

  c.get("logger")?.warn(
    {
      method: req.method,
      path: req.path,
    },
    "Route not found"
  );

  return c.json({ error: "Route not found" }, 404);
});

app.doc("/docs", (c) => ({
  openapi: "3.0.0",
  info: {
    title: `${env.APP_NAME} API`,
    version: env.APP_VERSION,
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Current environment",
    },
  ],
}));

app.get("/api/v1", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/v1/metrics", printMetrics);

app.get("/api/v1/crash", () => {
  throw new Error("Test crash");
});

app.route("/api/v1/health", health);
app.route("/api/v1/auth", authentication);

export { app };
