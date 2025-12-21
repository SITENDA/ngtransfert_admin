// src/lib/server/ensureValidAccessToken.ts

import { refreshAccessTokenServer } from "@/lib/server/refreshAccessTokenServer";
import { saveSession, deleteSession } from "@/lib/sessionStore";
import { Session } from "../../../types/session";

export async function ensureValidAccessToken(session: Session): Promise<boolean> {
    if (session.accessTokenExpiresAt > Date.now()) {
        return true;
    }

    const refreshed = await refreshAccessTokenServer();

    if (!refreshed.success) {
        await deleteSession(session.sessionId);
        return false;
    }

    await saveSession(session.sessionId, {
        ...session,
        accessToken: refreshed.accessToken,
        accessTokenExpiresAt: refreshed.expiresAt,
    });

    return true;
}

