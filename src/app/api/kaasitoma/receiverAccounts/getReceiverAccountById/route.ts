// src/app/api/kaasitoma/receiverAccounts/getReceiverAccountById/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { UserIdentifierEnum } from "../../../../../../types/UserIdentifier";

export async function GET(req: Request) {
    console.log("API route: getReceiverAccountById GET called");

    const session = await getSession();

    if (!session || !session.user) {
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
        `${getBackEndApiUrl()}/kaasitoma/receiverAccounts/getReceiverAccountByReceiverAccountId`
        + `?receiverAccountId=${receiverAccountId}`;

    console.log("🚀 BFF sending RECEIVER ACCOUNT BY ID request to:", backendUrl);

    // 🔥 Consistent identity pattern
    const identifierType = UserIdentifierEnum.enum.USERID;
    const identifierValue = String(session.user.userId);

    const result = await bffFetch<any>({
        url: backendUrl,
        method: "GET",
        identifierType,
        identifierValue,
    });

    if (!result.ok) {
        return NextResponse.json(
            {
                success: false,
                message: result.error || "Failed to fetch receiver account",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}