// src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { saveSession } from "@/lib/sessionStore";
import { mapBackendUserToBffUser } from "@/lib/mappers/mapBackendUserToBffUser";
import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";
import { BackendLoginPayload } from "../../../../../types/BackendLoginPayload";
import { setSessionCookie } from "@/lib/cookies";

import https from "https";

// ⚠️ DEV ONLY: allow self-signed HTTPS or HTTP backends
const insecureAgent =
    process.env.NODE_ENV === "development"
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined;

export async function POST(req: Request) {
    const body = await req.json();

    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),

            // ✅ IMPORTANT PART
            agent: process.env.BACKEND_URL?.startsWith("https")
                ? insecureAgent
                : undefined,
        }
    );

    // ✅ Always read text first
    const text = await springRes.text();

    let json: BackendHttpResponse<BackendLoginPayload | null>;

    try {
        json = JSON.parse(text);
    } catch {
        console.error("❌ Backend returned non-JSON:", text);
        return NextResponse.json(
            { success: false, message: "Server error. Please try again." },
            { status: 500 }
        );
    }

    if (!springRes.ok || !json.data) {
        return NextResponse.json(
            { success: false, message: json.message || "Invalid credentials" },
            { status: json.statusCode || 401 }
        );
    }

    const { user, accessTokenExpiresAt } = json.data;

    const bffUser = mapBackendUserToBffUser(user);
    const sessionId = randomUUID();

    await saveSession(sessionId, {
        user: bffUser,
        accessTokenExpiresAt,
        lastActivityAt: Date.now(),
    });

    await setSessionCookie(sessionId);

    return NextResponse.json({
        success: true,
        user: bffUser,
    });
}
