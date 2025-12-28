// src/lib/server/sessionCleanupJob.ts
import redis from "@/lib/redis";
import { SESSION_CONFIG } from "@/lib/sessionConfig";

const SESSION_PREFIX = "bff:session:";

export async function cleanupExpiredSessions() {
    const keys = await redis.keys(`${SESSION_PREFIX}*`);
    const now = Date.now();

    for (const key of keys) {
        const raw = await redis.get(key);
        if (!raw) continue;

        const session = JSON.parse(raw);

        if (
            now - session.lastActivityAt >
            SESSION_CONFIG.IDLE_TIMEOUT_MS
        ) {
            await redis.del(key);
            console.log("🧹 Removed idle session:", key);
        }
    }
}
