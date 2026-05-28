import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { saveSession } from "@/lib/sessionStore";
import { mapBackendUserToBffUser } from "@/lib/mappers/mapBackendUserToBffUser";
import { setSessionCookie } from "@/lib/cookies";

import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";
import { BackendLoginPayload } from "../../../../../types/BackendLoginPayload";

import { createBffToken } from "@/lib/createBffToken"; // ✅ import

// ✅ DEV ONLY: allow self-signed HTTPS
if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(req: Request) {
    const body = await req.json();

    // ✅ Generate temporary internal BFF token
    const internalSessionId = randomUUID();

    const bffToken = createBffToken({
        userId: "BFF_INTERNAL",
        sessionId: internalSessionId,
    });

    console.log("Generated BFF token:", bffToken);

    const springRes = await fetch(
        `${process.env.BACKEND_API_BASE_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

                // ✅ SEND JWT, NOT SECRET
                Authorization: `BFF ${bffToken}`,
            },
            body: JSON.stringify(body),
        }
    );

    const text = await springRes.text();

    let json: BackendHttpResponse<BackendLoginPayload | null>;

    try {
        json = JSON.parse(text);
    } catch {
        console.error("❌ Backend returned non-JSON:", text);

        return NextResponse.json(
            {
                success: false,
                message: "Server error. Please try again.",
            },
            {
                status: 500,
            }
        );
    }

    if (!springRes.ok || !json.data) {
        return NextResponse.json(
            {
                success: false,
                message: json.message || "Invalid credentials",
            },
            {
                status: json.statusCode || 401,
            }
        );
    }

    const {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
    } = json.data;

    const bffUser = mapBackendUserToBffUser(user);

    const sessionId = randomUUID();

    const now = Date.now();

    await saveSession(sessionId, {
        user: bffUser,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        lastActivityAt: now,
    });

    await setSessionCookie(sessionId);

    return NextResponse.json({
        success: true,
        user: bffUser,
    });
}