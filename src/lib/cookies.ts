// src/lib/cookies.ts
import {cookies, headers} from "next/headers";


const SESSION_COOKIE = "ngt_session";

export async function setSessionCookie(sessionId: string) {
    const cookieStore = await cookies();
    const headersList = await headers();

    const forwardedProto = headersList.get("x-forwarded-proto");
    const isHttps = forwardedProto === "https";
    const isProduction = process.env.NODE_ENV === "production";

    // cookieStore.set(SESSION_COOKIE, sessionId, {
    //     httpOnly: true,
    //     secure: isProduction || isHttps,
    //     sameSite: "lax",
    //     path: "/",
    //     maxAge: 60 * 60 * 24 * 7,
    // });

    cookieStore.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: true,                // 🔥 ALWAYS true in production
        sameSite: "none",            // 🔥 REQUIRED for subdomain calls
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value;
}