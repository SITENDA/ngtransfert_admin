// src/lib/server/ensureValidAccessToken.ts

import { saveSession, deleteSession } from "@/lib/sessionStore";
import { SESSION_CONFIG } from "@/lib/sessionConfig";
import { Session } from "../../../types/session";

export async function ensureValidAccessToken(
    session: Session
): Promise<boolean> {
    const now = Date.now();

    /* -------------------------------------------------
     * 1️⃣ HARD IDLE TIMEOUT
     * ------------------------------------------------- */
    if (now - session.lastActivityAt > SESSION_CONFIG.IDLE_TIMEOUT_MS) {
        console.log("⛔ Session idle timeout");
        await deleteSession(session.sessionId);
        return false;
    }

    /* -------------------------------------------------
     * 2️⃣ PROACTIVE ROTATION WINDOW
     * ------------------------------------------------- */
    if (
        session.accessTokenExpiresAt - now <
        SESSION_CONFIG.REFRESH_WINDOW_MS
    ) {
        console.log("🔄 Rotating access token via BFF");

        let res: Response;

        try {
            res = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/rotate-token`,
                {
                    method: "POST",
                    credentials: "include", // 🔥 HttpOnly cookie
                    cache: "no-store",
                }
            );
        } catch (err) {
            console.error("❌ rotate-token fetch failed:", err);
            await deleteSession(session.sessionId);
            return false;
        }

        if (!res.ok) {
            console.log("🧹 Token rotation rejected → logout");
            await deleteSession(session.sessionId);
            return false;
        }

        // rotation route already updated Redis
        return true;
    }

    /* -------------------------------------------------
     * 3️⃣ SLIDING SESSION UPDATE
     * ------------------------------------------------- */
    await saveSession(session.sessionId, {
        user: session.user,
        accessTokenExpiresAt: session.accessTokenExpiresAt,
        lastActivityAt: now,
    });

    return true;
}
