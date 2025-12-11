import { baseLogger } from "@/lib/logger";
import { pinoLogger } from "hono-pino";
import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";

function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

function getUserAgent(req: Request): string | undefined {
  return req.headers.get("user-agent") ?? undefined;
}

export const clientInfo: MiddlewareHandler = async (c, next) => {
  const req = c.req.raw;
  const ip = getClientIP(req);
  const userAgent = getUserAgent(req);
  const requestId = randomUUID();

  c.set("clientInfo", { ip, userAgent });
  c.set("requestId", requestId);

  await next();
};

export function requestLogger() {
  return pinoLogger({
    pino: baseLogger,
  });
}
