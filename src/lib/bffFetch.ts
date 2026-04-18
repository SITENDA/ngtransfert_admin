// src/lib/bffFetch.ts

import { createBffToken } from "@/lib/createBffToken";
import { randomUUID } from "crypto";
import { UserIdentifierType } from "../../types/UserIdentifier";

interface BffFetchOptions<TRequest> {
    url: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: TRequest;
    identifierType: UserIdentifierType;
    identifierValue: string;
}

export async function bffFetch<TResponse, TRequest = unknown>(
    options: BffFetchOptions<TRequest>
): Promise<{
    ok: boolean;
    status: number;
    data?: TResponse;
    error?: string;
}> {
    const {
        url,
        method = "POST",
        body,
        identifierType,
        identifierValue,
    } = options;

    if (!url) {
        console.error("❌ BFF fetch: URL is undefined");
        return {
            ok: false,
            status: 500,
            error: "Invalid backend URL",
        };
    }

    const bffToken = createBffToken({
        identifierType,
        identifierValue,
        sessionId: randomUUID(),
    });

    let res: Response;

    try {
        res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `BFF ${bffToken}`,
            },
            ...(body !== undefined && method !== "GET"
                ? { body: JSON.stringify(body) }
                : {}),
            cache: "no-store",
        });
    } catch (err) {
        console.error("❌ BFF fetch failed:", err);
        return {
            ok: false,
            status: 500,
            error: "Backend unreachable",
        };
    }

    console.log(`📡 [${method}] Response status:`, res.status);

    const text = await res.text();

    let json: unknown;

    try {
        json = JSON.parse(text);
    } catch {
        console.error("❌ Backend returned non-JSON:", text);
        return {
            ok: false,
            status: 500,
            error: "Invalid backend response",
        };
    }

    if (!res.ok) {
        const message =
            typeof json === "object" &&
            json !== null &&
            "message" in json &&
            typeof (json as { message?: unknown }).message === "string"
                ? (json as { message: string }).message
                : "Request failed";

        return {
            ok: false,
            status: res.status,
            error: message,
        };
    }

    return {
        ok: true,
        status: res.status,
        data: json as TResponse,
    };
}












// import { createBffToken } from "@/lib/createBffToken";
// import { cookies } from "next/headers";
//
// const BFF_PREFIX = "BFF ";
//
// export async function bffFetch(
//     url: string,
//     options: RequestInit & { session?: any } = {}
// ) {
//     if (!options.session) {
//         throw new Error("bffFetch requires a session");
//     }
//
//     const { user, sessionId } = options.session;
//
//     const bffToken = createBffToken({
//         userId: user.userId,
//         sessionId,
//     });
//
//     const cookieHeader = (await cookies())
//         .getAll()
//         .map((c) => `${c.name}=${c.value}`)
//         .join("; ");
//
//     // 🔥 DEV ONLY: disable TLS verification
//     if (process.env.NODE_ENV !== "production") {
//         process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//     }
//
//     return fetch(url, {
//         ...options,
//         headers: {
//             ...(options.headers ?? {}),
//             Authorization: `${BFF_PREFIX}${bffToken}`,
//             Cookie: cookieHeader,
//         },
//     });
// }