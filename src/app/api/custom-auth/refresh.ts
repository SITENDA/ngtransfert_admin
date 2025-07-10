// pages/api/custom-auth/refresh.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';
    const refreshEndpointUrl = `${backendApiBaseUrl}/auth/refresh`;

    try {
        console.log("Refresh endpoint URL hit: " + refreshEndpointUrl);

        // Grab the cookie header from *the browser’s* request to Next.js
        const cookieHeader = req.headers.cookie; // may be undefined
        console.log("cookieHeader: ", cookieHeader);

        const response = await fetch(refreshEndpointUrl, {
            method: 'POST',
            credentials: 'include', // let browser cookies (refreshToken) go
            headers: {
                'Content-Type': 'application/json',
                // Forward that cookie header along so Spring sees it:
                ...(cookieHeader ? { cookie: cookieHeader } : {}),
            }
        });


        if (!response.ok) {
            // Failed to refresh -- clear NextAuth session
            return res.status(401).json({ error: 'Refresh failed' });
        }

        const newTokens = await response.json(); // or however your backend returns them
        // Optionally store/update tokens in cookies or session here

        res.status(200).json({ success: true, tokens: newTokens });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ error: 'Server error during token refresh' });
    }
}
