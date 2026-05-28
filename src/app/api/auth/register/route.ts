// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { createBffToken } from "@/lib/createBffToken";

// ✅ DEV ONLY: allow self-signed HTTPS
if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ✅ Create temporary internal BFF token
        const internalSessionId = randomUUID();

        const bffToken = createBffToken({
            userId: "BFF_INTERNAL",
            sessionId: internalSessionId,
        });

        console.log("Generated Register BFF token:", bffToken);

        // ✅ Forward request to Spring Boot WITH BFF token
        const springRes = await fetch(
            `${process.env.BACKEND_API_BASE_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                    // ✅ IMPORTANT
                    Authorization: `BFF ${bffToken}`,
                },
                body: JSON.stringify(body),
            }
        );

        const text = await springRes.text();

        let json: any = null;

        try {
            json = JSON.parse(text);
        } catch {
            console.error("❌ Backend returned non-JSON:", text);

            return NextResponse.json(
                {
                    success: false,
                    message: "Server error. Please try again.",
                },
                {
                    status: 500,
                }
            );
        }

        if (!springRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: json.message || "Registration failed",
                },
                {
                    status: springRes.status,
                }
            );
        }

        // ✅ Safe response to browser
        return NextResponse.json({
            success: true,
            message:
                json.message ||
                "Registration successful. Please verify your email.",
        });

    } catch (error) {
        console.error("Register route error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unexpected server error.",
            },
            {
                status: 500,
            }
        );
    }
}