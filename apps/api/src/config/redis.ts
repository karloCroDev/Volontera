// External packages
import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function initalizeRedisClient() {
  if (!client) {
    client = createClient();
    client.on("error", (err) => console.error("Redis Client Error: ", err));
    client.on("connect", () => console.log("Redis client connected"));
    await client.connect();
  }
  return client;
}
