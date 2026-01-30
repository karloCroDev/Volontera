// External packages
import { initalizeRedisClient } from "@/config/redis";
import { User } from "@repo/database";

export async function rateLimit(userId: User["id"], expiration?: number) {
  const client = await initalizeRedisClient();

  if (!client) return false;
  const key = `rate:${userId}`;
  const count = await client.incr(key);
  if (count === 1) await client.expire(key, expiration ?? 60); // Istekne broj poslanih requestova za n broj sekundi
  if (count > 20) return false; // Ako je limit veći od 20, blokiramo sve buduce zahtjeve u tom periodu
  return true;
}
