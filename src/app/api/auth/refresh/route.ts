// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth'; // From your NextAuth config — use this only if you’re using `export const { signIn } = NextAuth(...)`

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
            return NextResponse.json({ error: 'Refresh failed', details: newTokens }, { status: response.status });
        }

        const newAccessToken = newTokens.data.token;
        const user = newTokens.data.user;

        console.log("➤ Refresh returned user:", user?.email || 'unknown');

        // Re-authenticate via NextAuth to update session JWT cookie
        await signIn("credentials", {
            accessToken: newAccessToken,
            userData: JSON.stringify(user),
            redirect: false,
            req // ensures JWT/session cookie is tied to current context
        });

        const setCookieHeader = response.headers.get('Set-Cookie');
        const responseWithCookies = NextResponse.json({ success: true, tokens: newTokens }, { status: 200 });

        if (setCookieHeader) {
            console.log("➤ Forwarding Set-Cookie header from backend");
            responseWithCookies.headers.set('Set-Cookie', setCookieHeader);
        }

        console.log("✅ Session updated with new access token. Returning refreshed tokens.");
        return responseWithCookies;

    } catch (error) {
        console.error("➤ Error during token refresh proxying:", error);
        return NextResponse.json({ error: 'Server error during token refresh' }, { status: 500 });
    }
}
