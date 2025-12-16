//  /home/amos/docure/ngtransfert_admin/src/lib/server/ensureValidAccessToken.ts

import { saveSession } from "@/lib/sessionStore";
import { refreshAccessTokenServer } from "@/lib/server/refreshAccessTokenServer";
import {Session} from "../../../types/session";

export async function ensureValidAccessToken(
    session: Session
): Promise<boolean> {
    const now = Date.now();

    // ✅ Token still valid
    if (session.accessTokenExpiresAt > now) {
        return true;
    }

    // 🔄 Refresh
    const refreshed = await refreshAccessTokenServer(session.refreshToken);

    if (!refreshed.success) {
        return false;
    }

    saveSession(session.sessionId, {
        ...session,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken ?? session.refreshToken,
        accessTokenExpiresAt: refreshed.expiresAt,
    });

    return true;
}
