// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getSession from "@/lib/getSession";
import {Session, User} from "next-auth";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';
    const refreshEndpointUrl = `${backendApiBaseUrl}/auth/refresh`;

    try {
        console.log("➤ /api/auth/refresh called");

        const cookieHeader = req.headers.get('cookie');
        console.log("➤ Cookie Header Present:", !!cookieHeader);

        const response = await fetch(refreshEndpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
            },
            cache: 'no-store',
        });

        console.log("➤ Backend response status:", response.status);

        const backendResponseText = await response.text();

        // Try parsing JSON
        let newTokens;
        try {
            newTokens = JSON.parse(backendResponseText);
        } catch (e) {
            console.error("➤ Failed to parse JSON from backend response");
            return NextResponse.json({ error: 'Invalid backend response format' }, { status: 500 });
        }

        if (!response.ok || !newTokens?.data?.token || !newTokens?.data?.user) {
            console.error("➤ Backend refresh failed or malformed data:", newTokens);
            return NextResponse.json({ error: newTokens?.message || 'Refresh failed', details: newTokens }, { status: response.status });
        }

        const newAccessToken = newTokens.data.token;
        const user: User = newTokens.data.user;

        console.log("➤ Refresh returned user:", user);
        console.log("➤ Refresh returned token:", newAccessToken);

        const session: Session | null = await getSession();

        if (session) {
            session.user = user;
            session.accessToken = newAccessToken;
        }

        console.log("Updated session-inside :", session?.accessToken);
        console.log("Updated session-return :", newAccessToken);

        const setCookieHeader = response.headers.get('Set-Cookie');
        const responseWithCookies = NextResponse.json({ success: true, tokens: newTokens }, { status: 200 });

        if (setCookieHeader) {
            console.log("➤ Forwarding Set-Cookie header from backend");
            responseWithCookies.headers.set('Set-Cookie', setCookieHeader);
        }
        return responseWithCookies;

    } catch (error) {
        console.error("➤ Error during token refresh proxying:", error);
        return NextResponse.json({ error: 'Server error during token refresh' }, { status: 500 });
    }
}
