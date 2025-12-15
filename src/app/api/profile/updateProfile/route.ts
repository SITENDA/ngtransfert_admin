// 2. Proxy API Route: src/app/api/profile/updateProfile/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function PUT(request: NextRequest) {
    if (!BACKEND_API_BASE_URL) {
        return NextResponse.json({ message: "Server configuration error: Backend URL is missing." }, { status: 500 });
    }

    try {
        const authHeader = request.headers.get("authorization");
        const cookieHeader = request.headers.get("cookie");
        const body = await request.json();

        const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/kaasitoma/user/updateProfile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { Authorization: authHeader }),
                ...(cookieHeader && { Cookie: cookieHeader }),
            },
            body: JSON.stringify(body),
        });

        const responseData = await backendResponse.text();

        try {
            const parsed = JSON.parse(responseData);
            return NextResponse.json(parsed, { status: backendResponse.status });
        } catch {
            return new NextResponse(responseData, {
                status: backendResponse.status,
                headers: { "Content-Type": "text/plain" },
            });
        }
    } catch (error) {
        console.error("Unhandled error in update profile proxy:", error);
        return NextResponse.json({ message: "Unexpected internal server error." }, { status: 500 });
    }
}
