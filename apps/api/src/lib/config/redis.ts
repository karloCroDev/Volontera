// External packages
import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function initalizeRedisClient() {
  if (!client) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    client = createClient({ url: redisUrl });
    client.on("error", (err) => console.error("Redis Client Error: ", err));
    client.on("connect", () => console.info("Redis client connected"));
    await client.connect();
  }
  return client;
}
