//  src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { saveSession } from "@/lib/sessionStore";
import { mapBackendUserToBffUser } from "@/lib/mappers/mapBackendUserToBffUser";
import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";
import { BackendLoginPayload } from "../../../../../types/BackendLoginPayload";
import { setSessionCookie } from "@/lib/cookies";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import {getBffIdentityFromLogin, LoginRequestSchema} from "../../../../../types/LoginRequest";
import {bffFetch} from "@/lib/bffFetch";


// ✅ DEV ONLY: allow self-signed HTTPS
if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(req: Request) {
    const rawBody = await req.json();

    const parsed = LoginRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid login request",
                errors: parsed.error.flatten(),
            },
            { status: 400 }
        );
    }

    const body = parsed.data;

    const backendUrl = `${getBackEndApiUrl()}/auth/login`;

    console.log("🚀 BFF sending request to:", backendUrl);
    console.log("📦 Payload:", {
        ...body,
        password: "[REDACTED]",
    });

    const { identifierType, identifierValue } = getBffIdentityFromLogin(body);

    const result = await bffFetch<BackendHttpResponse<BackendLoginPayload | null>>({
        url: backendUrl,
        method: "POST",
        body,
        identifierType,
        identifierValue,
    });

    if (!result.ok || !result.data?.data) {
        return NextResponse.json(
            {
                success: false,
                message: result.error || "Invalid credentials",
            },
            { status: result.status }
        );
    }

    const { user, accessToken, refreshToken, accessTokenExpiresAt } =  result.data.data;

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