// src/app/api/kaasitoma/topUp/getAllTopUpRequests/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";

export async function GET() {
    console.log("API route: getAllTopUpRequests GET called");

    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const backendUrl =
        `${process.env.BACKEND_API_BASE_URL}/kaasitoma/topUp/getAllTopUpRequests`;

    const response = await bffFetch(backendUrl, {
        method: "GET",
        session, // 🔐 REQUIRED
        cache: "no-store",
    });

    const text = await response.text();

    try {
        return NextResponse.json(JSON.parse(text), {
            status: response.status,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: text },
            { status: response.status }
        );
    }
}
