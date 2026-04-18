// src/app/api/kaasitoma/countries/getPriorityCountries/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { UserIdentifierEnum } from "../../../../../../types/UserIdentifier";

export async function GET() {
    console.log("API route: getPriorityCountries GET called");

    // 🔐 Enforce session
    const session = await getSession();
    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    // 🎯 Backend endpoint
    const backendUrl =
        `${getBackEndApiUrl()}/kaasitoma/countries/getPriorityCountries`;

    console.log("🚀 BFF sending PRIORITY COUNTRIES request to:", backendUrl);

    // 🔥 Same identity pattern as dashboard
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
                message: result.error || "Failed to fetch priority countries",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}