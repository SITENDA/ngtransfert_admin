import { NextResponse } from "next/server";
import {SetPreferencePayload} from "../../../../../types/SetPreferencePayload";
import {BackendHttpResponse} from "../../../../../types/BackendHttpResponse";
import {GetPreferenceResponse} from "../../../../../types/GetPreferenceResponse";

export async function POST(req: Request) {
    const body: SetPreferencePayload = await req.json();

    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/preferences`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
        }
    );

    const json: BackendHttpResponse<{
        key: string;
        value: string;
    }> = await springRes.json();

    if (!springRes.ok) {
        return NextResponse.json(
            {
                success: false,
                message: json.message ?? "Failed to save preference",
            },
            { status: springRes.status }
        );
    }

    return NextResponse.json({
        success: true,
        message: json.message ?? "Preference saved successfully",
        data: json.data,
    });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
        return NextResponse.json(
            { success: false, message: "Missing preference key" },
            { status: 400 }
        );
    }

    const springRes = await fetch(
        `${process.env.BACKEND_URL}/auth/preferences?key=${encodeURIComponent(key)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    );

    const json: BackendHttpResponse<{
        preference: GetPreferenceResponse;
    }> = await springRes.json();

    if (!springRes.ok) {
        return NextResponse.json(
            {
                success: false,
                message: json.message ?? "Failed to fetch preference",
            },
            { status: springRes.status }
        );
    }

    return NextResponse.json({
        success: true,
        message: json.message ?? "Preference retrieved successfully",
        data: json.data?.preference,
    });
}
