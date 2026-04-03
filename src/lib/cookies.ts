// src/lib/cookies.ts
import {cookies, headers} from "next/headers";

const SESSION_COOKIE = "ngt_session";

/**
 * Sets the HttpOnly session cookie (BFF session ID)
 */
export async function setSessionCookie(sessionId: string) {
    const cookieStore = await cookies();

    const headersList = await headers();
    const proto = headersList.get("x-forwarded-proto");

    const isSecure = proto === "https";

    cookieStore.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",           // IMPORTANT for login redirects
        path: "/",
        maxAge: 60 * 60 * 24 * 7,  // 7 days
    });

    console.log("🍪 Session cookie set:", sessionId);
}

/**
 * Clears the session cookie
 */
export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

/**
 * Reads the session cookie
 */
export async function getSessionId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value;
}
