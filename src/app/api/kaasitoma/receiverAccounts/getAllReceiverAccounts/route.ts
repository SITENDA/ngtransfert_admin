// src/app/api/kaasitoma/receiverAccounts/getAllReceiverAccounts/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { UserIdentifierEnum } from "../../../../../../types/UserIdentifier";

export async function GET() {
    console.log("API route: getAllReceiverAccounts GET called");

    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const backendUrl =
        `${getBackEndApiUrl()}/kaasitoma/receiverAccounts/getAllReceiverAccounts`;

    console.log("🚀 BFF sending ALL RECEIVER ACCOUNTS request to:", backendUrl);

    // 🔥 Same identity pattern everywhere
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
                message: result.error || "Failed to fetch receiver accounts",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}