// src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { saveSession } from "@/lib/sessionStore";
import { setSessionCookie } from "@/lib/cookies";
import { mapBackendUserToBffUser } from "@/lib/mappers/mapBackendUserToBffUser";

import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";
import { BackendLoginPayload } from "../../../../../types/BackendLoginPayload";

export async function POST(req: Request) {
    const body = await req.json();

    // 1️⃣ Forward login request to Spring Boot
    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
        }
    );

    // 2️⃣ Always parse backend response
    const json: BackendHttpResponse<BackendLoginPayload | null> =
        await springRes.json();

    // ❌ Authentication / validation failed
    if (!springRes.ok || !json.data) {
        return NextResponse.json(
            {
                success: false,
                message: json.message || "Invalid credentials",
            },
            { status: json.statusCode || 401 }
        );
    }

    // ✅ Safe to destructure now
    const { user, token, refreshToken, accessTokenExpiresAt } = json.data;

    // 3️⃣ Map backend user → BFF user
    const bffUser = mapBackendUserToBffUser(user);

    // 4️⃣ Create BFF session
    const sessionId = randomUUID();

    await saveSession(sessionId, {
        user: bffUser,
        accessToken: token,
        refreshToken,
        accessTokenExpiresAt,
    });

    // 5️⃣ Set HttpOnly BFF session cookie
    await setSessionCookie(sessionId);

    console.log("✅ Login complete, session established:", sessionId);

    // 6️⃣ Return SAFE response (NO TOKENS)
    return NextResponse.json({
        success: true,
        user: bffUser,
    });
}
