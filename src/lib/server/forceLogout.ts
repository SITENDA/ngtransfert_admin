// src/lib/server/forceLogout.ts
import { deleteSession } from "@/lib/sessionStore";
import { clearSessionCookie } from "@/lib/cookies";

export async function forceLogout(sessionId?: string) {
    if (sessionId) {
        await deleteSession(sessionId);
    }

    await clearSessionCookie();

    console.log("🧹 BFF logout: session + cookie cleared");
}
