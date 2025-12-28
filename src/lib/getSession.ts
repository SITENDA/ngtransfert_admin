// src/lib/getSession.ts

import {getSessionId} from "@/lib/cookies";
import {getSession} from "@/lib/sessionStore";
import {maybeCleanupSessions} from "@/lib/server/maybeCleanupSessions";

export default async function getBffSession() {
    await maybeCleanupSessions(); // 🔥 SAFE

    const sessionId = await getSessionId();
    if (!sessionId) return null;

    return await getSession(sessionId);
}