//  src/app/api/kaasitoma/depositAddresses/getDepositAddressesByCountryId/route.ts
import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { bffFetch } from "@/lib/bffFetch";

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const countryId = searchParams.get("countryId");
    const type = searchParams.get("type"); // cash | bank

    if (!countryId || !type) {
        return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    const backendUrl =
        type === "cash"
            ? `${process.env.BACKEND_API_BASE_URL}/kaasitoma/cashDepositAddresses/getCashDepositAddressesByCountryId?countryId=${countryId}`
            : `${process.env.BACKEND_API_BASE_URL}/kaasitoma/bankDepositAddresses/getBankDepositAddressesByCountryId?countryId=${countryId}`;

    const res = await bffFetch(backendUrl, {
        method: "GET",
        session,
        cache: "no-store",
    });

    const text = await res.text();
    try {
        return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
        return NextResponse.json({ message: text }, { status: res.status });
    }
}
