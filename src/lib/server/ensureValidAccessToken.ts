// src/lib/server/ensureValidAccessToken.ts
import { refreshAccessTokenServer } from "@/lib/server/refreshAccessTokenServer";
import { saveSession, deleteSession } from "@/lib/sessionStore";
import { SESSION_CONFIG } from "@/lib/sessionConfig";
import { Session } from "../../../types/session";

export async function ensureValidAccessToken(
    session: Session
): Promise<boolean> {
    const now = Date.now();

    // 1️⃣ HARD IDLE TIMEOUT
    if (now - session.lastActivityAt > SESSION_CONFIG.IDLE_TIMEOUT_MS) {
        console.log("⛔ Session idle timeout");
        await deleteSession(session.sessionId);
        return false;
    }

    // 2️⃣ PROACTIVE REFRESH WINDOW
    if (
        session.accessTokenExpiresAt - now <
        SESSION_CONFIG.REFRESH_WINDOW_MS
    ) {
        console.log("🔄 Proactive token refresh");

        const refreshed = await refreshAccessTokenServer(
            session.accessToken
        );

        if (!refreshed.success) {
            console.log("🧹 Refresh failed → logout");
            await deleteSession(session.sessionId);
            return false;
        }

        await saveSession(session.sessionId, {
            user: session.user,
            accessToken: refreshed.accessToken,
            accessTokenExpiresAt: refreshed.expiresAt,
            lastActivityAt: now,
        });

        return true;
    }

    // 3️⃣ SLIDING ACTIVITY UPDATE
    await saveSession(session.sessionId, {
        user: session.user,
        accessToken: session.accessToken,
        accessTokenExpiresAt: session.accessTokenExpiresAt,
        lastActivityAt: now,
    });

    return true;
}
