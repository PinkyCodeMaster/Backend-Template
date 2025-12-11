import { getRedis } from "@/lib/redis";

const redis = getRedis();

export async function cacheGetJSON<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export async function cacheSetJSON(
    key: string,
    value: unknown,
    ttlSeconds: number
): Promise<void> {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}
