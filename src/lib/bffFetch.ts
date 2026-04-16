// src/lib/bffFetch.ts
import { createBffToken } from "@/lib/createBffToken";
import { cookies } from "next/headers";

const BFF_PREFIX = "BFF ";

export async function bffFetch(
    url: string,
    options: RequestInit & { session?: any } = {}
) {
    if (!options.session) {
        throw new Error("bffFetch requires a session");
    }

    const { user, sessionId } = options.session;

    const bffToken = createBffToken({
        userId: user.userId,
        sessionId,
    });

    const cookieHeader = (await cookies())
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    // 🔥 DEV ONLY: disable TLS verification
    if (process.env.NODE_ENV !== "production") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            Authorization: `${BFF_PREFIX}${bffToken}`,
            Cookie: cookieHeader,
        },
    });
}