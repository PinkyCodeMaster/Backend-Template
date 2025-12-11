import { createRoute, z, OpenAPIHono } from "@hono/zod-openapi";
import env from "@/config/env";

const app = new OpenAPIHono();

const HealthResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  service: z.string().openapi({ example: "api-service" }),
  environment: z.string().openapi({ example: "development" }),
  timestamp: z.string().openapi({ example: "2025-01-01T12:00:00Z" }),
});

const healthRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
      description: "Health check",
    },
  },
});

app.openapi(healthRoute, (c) => {
  return c.json({
    status: "ok",
    service: `${env.APP_NAME}-api`,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

export const health = app;
