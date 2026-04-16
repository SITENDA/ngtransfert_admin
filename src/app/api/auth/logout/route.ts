// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/sessionStore";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("ngt_session")?.value;

    if (sessionId) {
        await deleteSession(sessionId);
    }

    cookieStore.delete("ngt_session");

    return NextResponse.json({ success: true });
}
