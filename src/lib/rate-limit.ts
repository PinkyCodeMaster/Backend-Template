import type { MiddlewareHandler } from "hono";
import { getRedis } from "@/lib/redis";

type RateLimitOptions = {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix?: string;
};

function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

export function rateLimit(options: RateLimitOptions): MiddlewareHandler {
  const { windowSeconds, maxRequests, keyPrefix = "rl" } = options;
  const redis = getRedis();

  return async (c, next) => {
    const ip = getClientIP(c.req.raw);
    const key = `${keyPrefix}:${ip}`;
    const ttl = windowSeconds;

    let count = 0;

    try {
      const result = await redis
        .multi()
        .incr(key)
        .expire(key, ttl)
        .exec();

      // ✅ Type-safe extraction
      const incrResult = result?.[0]?.[1];

      count = typeof incrResult === "number"
        ? incrResult
        : Number(incrResult ?? 0);
    } catch (err) {
      // ✅ FAIL OPEN if Redis dies (never block prod traffic)
      c.get("logger")?.error({ err }, "Rate limit Redis error");
      return next();
    }

    if (count > maxRequests) {
      return c.json(
        { error: "Too many requests" },
        429,
        {
          "Retry-After": ttl.toString(),
        }
      );
    }

    // ✅ Helpful headers
    c.res.headers.set("X-RateLimit-Limit", maxRequests.toString());
    c.res.headers.set(
      "X-RateLimit-Remaining",
      Math.max(maxRequests - count, 0).toString()
    );

    return next();
  };
}
