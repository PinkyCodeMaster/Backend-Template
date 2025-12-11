import { baseLogger } from "@/lib/logger";
import Redis from "ioredis";
import env from "@/config/env";

let redis: Redis | null = null;

export function getRedis() {
  if (!redis) {
    baseLogger.info({ url: env.REDIS_URL }, "Connecting to Redis");
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    redis.on("error", (err) => {
      baseLogger.error({ err }, "Redis error");
    });

    redis.on("connect", () => {
      baseLogger.info("Redis connected");
    });
  }

  return redis;
}
