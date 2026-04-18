//  src/app/api/kaasitoma/getDashboardContent/route.ts

import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";
import { BackendHttpResponse } from "../../../../../types/BackendHttpResponse";
import { DashboardDataPayload } from "../../../../../types/dashboardContent";
import { UserIdentifierEnum } from "../../../../../types/UserIdentifier";

export async function GET() {
    const session = await getSession();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const backendUrl = `${getBackEndApiUrl()}/kaasitoma/getDashboardContent`;

    console.log("🚀 BFF sending DASHBOARD request to:", backendUrl);

    const identifierType = UserIdentifierEnum.enum.USERID;
    const identifierValue = String(session.user.userId);

    const result = await bffFetch<BackendHttpResponse<DashboardDataPayload>>({
        url: backendUrl,
        method: "GET",
        identifierType,
        identifierValue,
    });

    if (!result.ok) {
        return NextResponse.json(
            {
                success: false,
                message: result.error || "Failed to fetch dashboard content",
            },
            { status: result.status }
        );
    }

    return NextResponse.json(result.data, {
        status: result.status,
    });
}