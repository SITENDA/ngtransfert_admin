// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";
import {ContactPayload} from "../../../../../types/ContactPayload";


export async function POST(req: Request) {

    const body: ContactPayload = await req.json();

    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/contact`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
