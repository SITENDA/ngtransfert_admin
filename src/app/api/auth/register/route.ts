// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { bffFetch } from "@/lib/bffFetch";
import { getBffIdentityFromLogin } from "../../../../../types/LoginRequest";
import {BackendHttpResponse} from "../../../../../types/BackendHttpResponse";
import {BackendRegisterPayload} from "../../../../../types/BackendRegisterPayload"; // reuse same helper

export async function POST(req: Request) {
    const body = await req.json();

    const backendUrl = `${getBackEndApiUrl()}/auth/register`;

    console.log("🚀 BFF sending REGISTER request to:", backendUrl);
    console.log("📦 Payload:", {
        ...body,
        password: "[REDACTED]",
    });

    // 🔥 Reuse same identity extractor as login
    let identifierType;
    let identifierValue: string;

    try {
        const identity = getBffIdentityFromLogin(body);
        identifierType = identity.identifierType;
        identifierValue = identity.identifierValue;
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid identifier type" },
            { status: 400 }
        );
    }

    // 🔥 Use shared BFF fetch
    const result = await bffFetch<BackendHttpResponse<BackendRegisterPayload | null>>({
        url: backendUrl,
        method: "POST",
        body,
        identifierType,
        identifierValue,
    });

    if (!result.ok) {
        return NextResponse.json(
            {
                success: false,
                message: result.error || "Registration failed",
            },
            { status: result.status }
        );
    }

    return NextResponse.json({
        success: true,
    });
}