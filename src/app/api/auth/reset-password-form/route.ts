//  src/app/api/auth/reset-password-form/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/confirmResetPassword`,
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
                message: error.message || "Reset password failed",
            },
            { status: springRes.status }
        );
    }

    await springRes.json().catch(() => null);

    return NextResponse.json({
        success: true,
    });
}
