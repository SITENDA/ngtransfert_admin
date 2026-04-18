// src/app/api/kaasitoma/topUp/topUpAccountBalance/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { UserIdentifierEnum } from "../../../../../../types/UserIdentifier";

export async function POST(req: Request) {
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const formData = await req.formData();

    const backendUrl =
        `${getBackEndApiUrl()}/kaasitoma/topUp/topUpAccountBalance`;

    console.log("🚀 BFF sending TOP UP ACCOUNT BALANCE request to:", backendUrl);

    // 🔥 Consistent identity pattern
    const identifierType = UserIdentifierEnum.enum.USERID;
    const identifierValue = String(session.user.userId);

    const result = await bffFetch<any, FormData>({
        url: backendUrl,
        method: "POST",
        body: formData,
        identifierType,
        identifierValue,
    });

    if (!result.ok) {
        return NextResponse.json(
            {
                success: false,
                message: result.error || "Failed to top up account balance",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}