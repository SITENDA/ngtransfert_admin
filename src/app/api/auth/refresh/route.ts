// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'; // Correct imports for App Router

// Export a named function for the POST method
export async function POST(req: NextRequest) {
    const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';
    const refreshEndpointUrl = `${backendApiBaseUrl}/auth/refresh`;

    try {
        console.log("Next.js API Route: /api/auth/refresh hit.");
        console.log("Forwarding request to backend: " + refreshEndpointUrl);

        // Grab the cookie header from *the browser’s* request to Next.js
        // In App Router's NextRequest, headers are accessed via .get()
        const cookieHeader = req.headers.get('cookie');
        console.log("Next.js API Route: cookieHeader: ", cookieHeader);

        const response = await fetch(refreshEndpointUrl, {
            method: 'POST',
            // credentials: 'include' is for client-side fetch, not server-side fetch in API routes.
            // Cookies are automatically handled by the server-side fetch if the cookieHeader is forwarded.
            headers: {
                'Content-Type': 'application/json',
                // Forward that cookie header along so Spring sees it:
                ...(cookieHeader ? { 'Cookie': cookieHeader } : {}), // Use 'Cookie' as the header name
            },
            // Important for server-side fetches to prevent caching of the proxy request
            cache: 'no-store'
        });


        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'Unknown error from backend refresh' }));
            console.error("Next.js API Route: Backend refresh failed:", response.status, errorBody);
            // Return a NextResponse with appropriate status and JSON body
            return NextResponse.json({ error: 'Refresh failed', details: errorBody }, { status: 401 });
        }

        const newTokens = await response.json(); // or however your backend returns them

        // If your backend sets new cookies (like a new refresh token),
        // you might need to forward those Set-Cookie headers back to the client.
        // This is a common pattern for refresh token rotation.
        const responseWithCookies = NextResponse.json({ success: true, tokens: newTokens }, { status: 200 });

        // Iterate through backend's 'Set-Cookie' headers and set them on the Next.js response
        // This ensures the new refresh token cookie (if any) is passed to the browser.
        const setCookieHeaders = response.headers.get('Set-Cookie');
        if (setCookieHeaders) {
            // Note: If multiple Set-Cookie headers are sent by the backend,
            // get('Set-Cookie') might only return the first. You might need
            // response.headers.raw()['set-cookie'] for all of them.
            // For simplicity, assuming one for now.
            responseWithCookies.headers.set('Set-Cookie', setCookieHeaders);
        }

        return responseWithCookies;

    } catch (error) {
        console.error("Next.js API Route: Error refreshing token:", error);
        return NextResponse.json({ error: 'Server error during token refresh' }, { status: 500 });
    }
}