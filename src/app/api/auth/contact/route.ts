// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";
import {ContactPayload} from "../../../../../types/ContactPayload";


export async function POST(req: Request) {
    const session = await getSession();

    // 🔐 Require authentication
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const body: ContactPayload = await req.json();

    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/contact`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        }
    );

    // ✅ Backend returns HttpResponse with NO data payload
    const json: BackendHttpResponse<null> = await springRes.json();

    if (!springRes.ok) {
        return NextResponse.json(
            {
                success: false,
                message: json.message ?? "Failed to send message",
            },
            { status: springRes.status }
        );
    }

    return NextResponse.json({
        success: true,
        message: json.message ?? "Message received successfully",
    });
}
