// src/app/api/kaasitoma/topUp/topUpAccountBalance/route.ts
import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";

export async function POST(req: Request) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const formData = await req.formData();

    const backendUrl =
        `${process.env.BACKEND_URL}/kaasitoma/topUp/topUpAccountBalance`;

    const response = await bffFetch(backendUrl, {
        method: "POST",
        body: formData,
        session, // 🔥 bind request to Redis session
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
