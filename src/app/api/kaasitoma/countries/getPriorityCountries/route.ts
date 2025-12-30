// src/app/api/kaasitoma/countries/getPriorityCountries/route.ts
import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";

export async function GET() {
    console.log("API route: getPriorityCountries GET called");

    // 🔐 Enforce session presence (BFF-level auth)
    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    // 🎯 Backend endpoint
    const backendUrl =
        `${process.env.BACKEND_URL}/kaasitoma/countries/getPriorityCountries`;

    // 🔁 Forward via BFF
    const response = await bffFetch(backendUrl, {
        method: "GET",
        session, // 🔥 REQUIRED: binds BFF token to Redis session
    });

    const text = await response.text();

    // 🧠 Defensive JSON handling (same as other routes)
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
