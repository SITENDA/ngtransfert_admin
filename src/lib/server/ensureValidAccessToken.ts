//  /home/amos/docure/ngtransfert_admin/src/lib/server/ensureValidAccessToken.ts

import {deleteSession, saveSession} from "@/lib/sessionStore";
import { refreshAccessTokenServer } from "@/lib/server/refreshAccessTokenServer";
import {Session} from "../../../types/session";
import {clearSessionCookie} from "@/lib/cookies";

export async function ensureValidAccessToken(
    session: Session
): Promise<boolean> {
    if (session.accessTokenExpiresAt > Date.now()) {
        return true;
    }

    const refreshed = await refreshAccessTokenServer(session.refreshToken);

    if (!refreshed.success) {
        await deleteSession(session.sessionId);
        await clearSessionCookie();
        console.log("🧹 Access token refresh failed → logout");
        return false;
    }

    await saveSession(session.sessionId, {
        user: session.user,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken ?? session.refreshToken,
        accessTokenExpiresAt: refreshed.expiresAt,
    });

    return true;
}
