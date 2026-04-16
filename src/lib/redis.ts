//  src/lib/redis.ts

import Redis from "ioredis";

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
});

redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
});

export default redis;
