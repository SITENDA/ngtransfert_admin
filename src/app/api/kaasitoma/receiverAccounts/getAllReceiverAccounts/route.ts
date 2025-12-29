// src/app/api/kaasitoma/receiverAccounts/getAllReceiverAccounts/route.ts
import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";

export async function GET() {
    console.log("API route: getAllReceiverAccounts GET called");

    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const backendUrl = `${process.env.BACKEND_URL}/kaasitoma/receiverAccounts/getAllReceiverAccounts`;

    const response = await bffFetch(backendUrl, {
        method: "GET",
        session, // 🔥 pass session explicitly (same pattern as createReceiverAccount)
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
