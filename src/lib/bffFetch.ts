// src/lib/bffFetch.ts
import { createBffToken } from "@/lib/createBffToken";
import { cookies } from "next/headers";

const BFF_PREFIX = "BFF ";

export async function bffFetch(
    url: string,
    options: RequestInit & { session?: any } = {}
) {

    console.log("SESSION IN BFF FETCH:", options.session);
    console.log("SESSION ID:", options.session?.sessionId);
    console.log("USER:", options.session?.user);


    if (!options.session) {
        throw new Error("bffFetch requires a session");
    }



    const { user, sessionId } = options.session;

    // ✅ ONE token creator ONLY
    const bffToken = createBffToken({
        userId: user.userId,
        sessionId,
    });

    // Forward cookies if needed
    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            Authorization: `${BFF_PREFIX}${bffToken}`,
            Cookie: cookieHeader,
        },
    });
}
