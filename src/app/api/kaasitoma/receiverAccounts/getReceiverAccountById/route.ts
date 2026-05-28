//  src/app/api/kaasitoma/receiverAccounts/getReceiverAccountById/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";

export async function GET(req: Request) {
    console.log("API route: getReceiverAccountById GET called");

    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const receiverAccountId = searchParams.get("receiverAccountId");

    if (!receiverAccountId) {
        return NextResponse.json(
            { success: false, message: "receiverAccountId is required" },
            { status: 400 }
        );
    }

    const backendUrl =
        `${process.env.BACKEND_API_BASE_URL}/kaasitoma/receiverAccounts/getReceiverAccountByReceiverAccountId`
        + `?receiverAccountId=${receiverAccountId}`;

    const response = await bffFetch(backendUrl, {
        method: "GET",
        session,
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
