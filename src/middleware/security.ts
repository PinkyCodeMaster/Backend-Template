import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import env from "@/config/env";

export const corsMiddleware = cors({
  origin: (origin) => {
    if (origin === env.FRONTEND_URL) return origin;

    if (
      env.NODE_ENV === "development" &&
      (origin?.startsWith("exp://") || origin?.includes("localhost"))
    ) {
      return origin;
    }

    return undefined;
  },

  credentials: true,

  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowHeaders: [
    "Content-Type",
    "Authorization",
    "expo-origin",
    "x-skip-oauth-proxy",
  ],
});

export const securityHeaders: MiddlewareHandler = async (c, next) => {
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("Referrer-Policy", "no-referrer");
  c.res.headers.set("X-DNS-Prefetch-Control", "off");

  await next();
};
