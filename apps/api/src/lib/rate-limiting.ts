// External packages
import { initalizeRedisClient } from "@/config/redis";
import { User } from "@repo/database";

export async function rateLimit(userId: User["id"], expiration?: number) {
  const client = await initalizeRedisClient();

  if (!client) return false;
  const key = `rate:${userId}`;
  const count = await client.incr(key);
  if (count === 1) await client.expire(key, expiration ?? 60); // Istekne broj poslanih requestova za n broj sekundi
  if (count > 15) return false;
  return true;
}

export async function clearRateLimit(userId: User["id"]) {
  const client = await initalizeRedisClient();
  if (!client) return;
  const key = `rate:${userId}`;
  await client.del(key);
}
