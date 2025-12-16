import { NextResponse } from "next/server";
import { getSessionId, clearSessionCookie } from "@/lib/cookies";
import { deleteSession } from "@/lib/sessionStore";

export async function POST() {
    const sessionId = getSessionId();
    if (sessionId) deleteSession(sessionId);

    clearSessionCookie();

    return NextResponse.json({ success: true });
}
