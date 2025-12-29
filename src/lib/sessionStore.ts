//  /home/amos/docure/ngtransfert_admin/src/lib/sessionStore.ts

import redis from "@/lib/redis";
import { Session } from "../../types/session";

const SESSION_PREFIX = "bff:session:";

function key(sessionId: string) {
    return `${SESSION_PREFIX}${sessionId}`;
}

export async function saveSession(
    sessionId: string,
    session: Omit<Session, "sessionId" | "createdAt">
) {
    const fullSession: Session = {
        sessionId,
        createdAt: Date.now(),
        ...session,
    };

    await redis.set(
        key(sessionId),
        JSON.stringify(fullSession),
        // "EX",
        // 60 * 65 // 65 minutes
        "EX",
        60 * 60 * 2 // 2 hours hard cap

    );
}


export async function getSession(sessionId: string): Promise<Session | null> {
    const raw = await redis.get(key(sessionId));
    if (!raw) return null;
    return JSON.parse(raw) as Session;
}

export async function deleteSession(sessionId: string) {
    await redis.del(key(sessionId));
}
