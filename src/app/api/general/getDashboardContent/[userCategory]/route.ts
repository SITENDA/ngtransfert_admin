// src/app/api/general/getDashboardContent/[userCategory]/route.ts

import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";
import {UserCategoryEnum} from "@/enums/UserCategoryEnum";

export async function GET(
    request: NextRequest,
    context: {
        params: Promise<{
            userCategory: string;
        }>;
    }
) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
        );
    }

    const { userCategory } = await context.params;

    // Validate category
    if (
        userCategory !== UserCategoryEnum.KAASITOMA &&
        userCategory !== UserCategoryEnum.NNYINIMU
    ) {
        return NextResponse.json(
            { success: false, message: "Invalid user category." },
            { status: 400 }
        );
    }

    const backendUrl = `${process.env.BACKEND_API_BASE_URL}` + `/${userCategory}/getDashboardContent`;

    const response = await bffFetch(backendUrl, {
        method: "GET",
        session,
        cache: "no-store",
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