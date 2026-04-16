// src/lib/server/authenticatedFetch.ts
import getSession from "@/lib/getSession";
import { ensureValidAccessToken } from "@/lib/server/ensureValidAccessToken";

export async function authenticatedFetch(
    url: string,
    init: RequestInit = {}
) {
    const session = await getSession();

    if (!session) {
        throw new Error("No session");
    }

    const ok = await ensureValidAccessToken(session);
    if (!ok) {
        throw new Error("Session expired");
    }

    // ✅ NO cookie handling needed
    return fetch(url, {
        ...init,
        cache: "no-store",
    });
}
