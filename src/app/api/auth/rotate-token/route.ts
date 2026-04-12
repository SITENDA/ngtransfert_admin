// src/app/api/auth/rotate-token/route.ts
import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { saveSession, deleteSession } from "@/lib/sessionStore";
import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";

export async function POST() {
    // 1️⃣ Load BFF session
    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    // 2️⃣ Call backend using Authorization header (NEW DESIGN)
    let springRes: Response;
    try {
        springRes = await fetch(
            `${process.env.BACKEND_URL}/auth/rotate-token`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`, // 🔥 FIXED
                },
                cache: "no-store",
            }
        );
    } catch (err) {
        console.error("❌ rotate-token fetch failed:", err);
        await deleteSession(session.sessionId);
        return NextResponse.json(
            { success: false, message: "Session expired" },
            { status: 401 }
        );
    }

    // 3️⃣ Read as text first (defensive)
    const text = await springRes.text();

    let json: BackendHttpResponse<{
        accessToken: string;              // 🔥 NEW
        accessTokenExpiresAt: number;
    } | null>;

    try {
        json = JSON.parse(text);
    } catch {
        console.error("❌ rotate-token returned non-JSON:", text);
        await deleteSession(session.sessionId);
        return NextResponse.json(
            { success: false, message: "Session expired" },
            { status: 401 }
        );
    }

    // 4️⃣ Backend rejected → logout
    if (!springRes.ok || !json.data) {
        await deleteSession(session.sessionId);
        return NextResponse.json(
            { success: false, message: json.message || "Session expired" },
            { status: 401 }
        );
    }

    // 5️⃣ Update Redis session (STORE NEW TOKEN)
    await saveSession(session.sessionId, {
        user: session.user,
        accessToken: json.data.accessToken,              // 🔥 NEW TOKEN
        refreshToken: session.refreshToken,              // keep existing
        accessTokenExpiresAt: json.data.accessTokenExpiresAt,
        lastActivityAt: Date.now(),
    });

    // 6️⃣ Safe response
    return NextResponse.json({ success: true });
}