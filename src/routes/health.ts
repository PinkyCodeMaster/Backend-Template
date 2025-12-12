import { createRoute, z, OpenAPIHono } from "@hono/zod-openapi";
import env from "@/config/env";

const app = new OpenAPIHono();

const HealthResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  service: z.string().openapi({ example: `${env.APP_NAME}-api` }),
  environment: z.string().openapi({ example: env.NODE_ENV }),
  timestamp: z.string().openapi({ example: new Date().toISOString() }),
});

const healthRoute = createRoute({
  method: "get",
  summary: "Health check",
  description: "Service liveness and environment metadata",
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
