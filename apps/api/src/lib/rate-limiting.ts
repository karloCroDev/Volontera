// Config
import { initalizeRedisClient } from "@/lib/config/redis";

// Lib
import { cacheKey } from "@/lib/cache-json";

// Database
import { User } from "@repo/database";

export type RateLimitArgs = {
  userId: User["id"];
  additionalTags: string[];
  expiration?: number;
  limit?: number;
};

export async function rateLimit({
  userId,
  additionalTags = [],
  expiration = 5,
  limit = 5,
}: RateLimitArgs) {
  const client = await initalizeRedisClient();

  if (!client) return false;
  const key = cacheKey(["rate-limit", ...additionalTags, userId]);
  const count = await client.incr(key);
  if (count === 1) await client.expire(key, expiration * 60);

  return count <= limit;
}
