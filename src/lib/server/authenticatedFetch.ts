// src/lib/server/authenticatedFetch.ts
import { ensureValidAccessToken } from "@/lib/server/ensureValidAccessToken";
import getSession from "@/lib/getSession";

export async function authenticatedFetch(url: string, init?: RequestInit) {
    const session = await getSession();

    if (!session) {
        throw new Error("No session");
    }

    const ok = await ensureValidAccessToken(session);

    if (!ok) {
        throw new Error("Session expired");
    }

    return fetch(url, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            Authorization: `Bearer ${session.accessToken}`,
        },
    });
}