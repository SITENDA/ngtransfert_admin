//  /home/amos/docure/ngtransfert_admin/src/app/api/auth/refresh/route.ts

import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/cookies";
import { getSession, saveSession, deleteSession } from "@/lib/sessionStore";
import { jwtDecode } from "jwt-decode";
import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";

export async function POST() {
    const sessionId = await getSessionId();

    if (!sessionId) {
        return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const session = await getSession(sessionId);

    if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 401 });
    }

    // 1️⃣ Call backend refresh endpoint
    const backendApiBaseUrl =
        process.env.BACKEND_API_BASE_URL || "http://localhost:8080";

    const refreshRes = await fetch(`${backendApiBaseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include", // forward refresh cookie
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!refreshRes.ok) {
        // 🔥 Refresh failed → destroy session
        await deleteSession(sessionId);
        return NextResponse.json(
            { error: "Refresh failed" },
            { status: 401 }
        );
    }

    // 2️⃣ Parse backend response
    const json: BackendHttpResponse<{
        token: string;
        user: unknown;
    }> = await refreshRes.json();

    const newAccessToken = json.data?.token;

    if (!newAccessToken) {
        await deleteSession(sessionId);
        return NextResponse.json(
            { error: "Invalid refresh response" },
            { status: 401 }
        );
    }

    // 3️⃣ Decode expiry
    const decoded = jwtDecode<{ exp: number }>(newAccessToken);

    // 4️⃣ Update Redis session
    await saveSession(sessionId, {
        user: session.user, // user stays the same
        accessToken: newAccessToken,
        refreshToken: session.refreshToken,
        accessTokenExpiresAt: decoded.exp * 1000,
    });

    return NextResponse.json({ success: true });
}
