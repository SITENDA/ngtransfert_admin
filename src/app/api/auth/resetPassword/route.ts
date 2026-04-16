// src/app/api/auth/resetPassword/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/resetPassword`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
        }
    );

    if (!springRes.ok) {
        const error = await springRes.json().catch(() => ({}));
        return NextResponse.json(
            { success: false, message: error.message || "Reset failed" },
            { status: 400 }
        );
    }

    const json = await springRes.json();

    return NextResponse.json({
        success: true,
        message: json.message ?? "Reset request accepted",
    });
}
