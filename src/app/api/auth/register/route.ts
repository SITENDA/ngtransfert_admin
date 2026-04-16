// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    // 1️⃣ Forward register request to Spring Boot
    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/register`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );

    if (!springRes.ok) {
        const error = await springRes.json().catch(() => ({}));
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Registration failed",
            },
            { status: springRes.status }
        );
    }

    // 2️⃣ Backend may return a message or user — we don’t care
    await springRes.json().catch(() => null);

    // 3️⃣ SAFE response (no tokens, no cookies)
    return NextResponse.json({
        success: true,
    });
}
