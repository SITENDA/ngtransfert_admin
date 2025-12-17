import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/sessionStore";

const SESSION_COOKIE = "ngt_session";

export async function POST() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (sessionId) {
        await deleteSession(sessionId);
    }

    cookieStore.delete(SESSION_COOKIE);

    return NextResponse.json({ success: true });
}
