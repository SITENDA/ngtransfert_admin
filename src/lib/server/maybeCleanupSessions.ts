// src/lib/server/maybeCleanupSessions.ts
import redis from "@/lib/redis";
import { cleanupExpiredSessions } from "./sessionCleanupJob";

const CLEANUP_KEY = "bff:lastCleanupAt";
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

export async function maybeCleanupSessions() {
    const now = Date.now();
    const lastRun = await redis.get(CLEANUP_KEY);

    if (!lastRun || now - Number(lastRun) > CLEANUP_INTERVAL_MS) {
        await cleanupExpiredSessions();
        await redis.set(CLEANUP_KEY, now.toString());
    }
}
