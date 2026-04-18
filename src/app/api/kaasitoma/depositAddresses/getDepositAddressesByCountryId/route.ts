// src/app/api/kaasitoma/depositAddresses/getDepositAddressesByCountryId/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { UserIdentifierEnum } from "../../../../../../types/UserIdentifier";

export async function GET(req: Request) {
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const countryId = searchParams.get("countryId");
    const type = searchParams.get("type"); // cash | bank

    if (!countryId || !type) {
        return NextResponse.json(
            { success: false, message: "Missing parameters" },
            { status: 400 }
        );
    }

    const baseUrl = getBackEndApiUrl();

    const backendUrl =
        type === "cash"
            ? `${baseUrl}/kaasitoma/cashDepositAddresses/getCashDepositAddressesByCountryId?countryId=${countryId}`
            : `${baseUrl}/kaasitoma/bankDepositAddresses/getBankDepositAddressesByCountryId?countryId=${countryId}`;

    console.log("🚀 BFF sending DEPOSIT ADDRESSES request to:", backendUrl);

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
                message: result.error || "Failed to fetch deposit addresses",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}