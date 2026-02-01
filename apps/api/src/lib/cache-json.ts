// Config
import { initalizeRedisClient } from "@/config/redis";

export async function redisGetOrSetJson<T>({
  key,
  ttlSeconds,
  loader,
}: {
  key: string;
  ttlSeconds: number;
  loader: () => Promise<T>;
}): Promise<T> {
  try {
    const client = await initalizeRedisClient();
    const cached = await client.get(key);
    if (cached !== null) {
      return JSON.parse(cached) as T;
    }

    const value = await loader();
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    return value;
  } catch (err) {
    // Ako je redis server dolje da nebi padala cijela aplikacija
    return loader();
  }
}

export function cacheKey(parts: (string | number | undefined | null)[]) {
  return parts
    .filter((p) => p !== undefined && p !== null)
    .map((p) => String(p))
    .join(":");
}
