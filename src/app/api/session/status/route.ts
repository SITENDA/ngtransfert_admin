//  /home/amos/docure/ngtransfert_admin/src/app/api/session/status/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { SESSION_CONFIG } from "@/lib/sessionConfig";

export async function GET() {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const now = Date.now();
    const remainingMs =
        SESSION_CONFIG.IDLE_TIMEOUT_MS - (now - session.lastActivityAt);

    return NextResponse.json({
        authenticated: true,
        remainingMs: Math.max(0, remainingMs),
    });
}
