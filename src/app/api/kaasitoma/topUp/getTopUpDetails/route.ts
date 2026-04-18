// src/app/api/kaasitoma/topUp/getTopUpDetails/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { UserIdentifierEnum } from "../../../../../../types/UserIdentifier";

export async function GET(req: Request) {
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const receiverAccountId = searchParams.get("receiverAccountId");
    const countryId = searchParams.get("countryId");

    if (!receiverAccountId || !countryId) {
        return NextResponse.json(
            { success: false, message: "Missing receiverAccountId or countryId" },
            { status: 400 }
        );
    }

    const backendUrl =
        `${getBackEndApiUrl()}/kaasitoma/topUp/getTopUpDetails` +
        `?receiverAccountId=${receiverAccountId}&countryId=${countryId}`;

    console.log("🚀 BFF sending TOP UP DETAILS request to:", backendUrl);

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
                message: result.error || "Failed to fetch top up details",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}