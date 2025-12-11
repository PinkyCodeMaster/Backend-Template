import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import env from "@/config/env";

function isAllowedDevOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return origin.startsWith("exp://") || origin.includes("localhost") || origin.includes("127.0.0.1");
}

export const corsMiddleware = cors({
  origin: (origin) => {
    const allowed = new Set([env.FRONTEND_URL, ...env.CORS_EXTRA_ORIGINS]);

    if (origin && allowed.has(origin)) return origin;

    if (
      env.NODE_ENV === "development" &&
      isAllowedDevOrigin(origin)
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
  c.res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  c.res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  c.res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  c.res.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  if (env.NODE_ENV === "production") {
    c.res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    c.res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; img-src 'self' data: https:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; connect-src 'self' https:;"
    );
  }

  await next();
};
