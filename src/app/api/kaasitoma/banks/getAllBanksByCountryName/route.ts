// src/app/api/kaasitoma/banks/getAllBanksByCountryName/route.ts

import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";

export async function GET(request: NextRequest) {
    console.log("API route: getAllBanksByCountryName GET called");

    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            {
                success: false,
                message: "Authentication required.",
            },
            { status: 401 }
        );
    }

    const searchParams = request.nextUrl.searchParams;

    const countryName = searchParams.get("countryName");

    if (!countryName) {
        return NextResponse.json(
            {
                success: false,
                message: "countryName is required",
            },
            { status: 400 }
        );
    }

    const backendUrl =
        `${process.env.BACKEND_API_BASE_URL}/kaasitoma/banks/getAllBanksByCountryName?countryName=${encodeURIComponent(countryName)}`;

    const response = await bffFetch(backendUrl, {
        method: "GET",
        session, // 🔥 REQUIRED
        cache: "no-store",
    });

    const text = await response.text();

    try {
        return NextResponse.json(JSON.parse(text), {
            status: response.status,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: text,
            },
            {
                status: response.status,
            }
        );
    }
}