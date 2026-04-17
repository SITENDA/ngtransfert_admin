// src/lib/server/refreshAccessTokenServer.ts

import { RefreshTokenResult } from "../../../types/RefreshTokenResult";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";

export async function refreshAccessTokenServer(
    accessToken: string
): Promise<RefreshTokenResult> {

    const backendUrl = getBackEndApiUrl();

    try {
        const res = await fetch(`${backendUrl}/auth/refresh`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok || !json?.data?.accessToken) {
            return { success: false };
        }

        return {
            success: true,
            accessToken: json.data.accessToken,
            expiresAt: json.data.accessTokenExpiresAt,
            user: json.data.user,
        };
    } catch {
        return { success: false };
    }
}
