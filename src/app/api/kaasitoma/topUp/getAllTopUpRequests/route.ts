// src/app/api/kaasitoma/topUp/getAllTopUpRequests/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { UserIdentifierEnum } from "../../../../../../types/UserIdentifier";

export async function GET() {
    console.log("API route: getAllTopUpRequests GET called");

    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const backendUrl =
        `${getBackEndApiUrl()}/kaasitoma/topUp/getAllTopUpRequests`;

    console.log("🚀 BFF sending TOP UP REQUESTS request to:", backendUrl);

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
                message: result.error || "Failed to fetch top up requests",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}