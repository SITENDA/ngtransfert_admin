// src/lib/getSession.ts

import { getSessionId } from "@/lib/cookies";
import { getSession } from "@/lib/sessionStore";
import { Session } from "../../types/session";

export default async function getBffSession(): Promise<Session | null> {
    const sessionId = await getSessionId();

    if (!sessionId) return null;

    const session = await getSession(sessionId); // ✅ FIX: await

    // console.log("📦 Loaded BFF session:", session);
    // console.log("📦 Loaded BFF session.");

    return session;
}
