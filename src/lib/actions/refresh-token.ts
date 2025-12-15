"use server";

import { jwtDecode } from "jwt-decode";
import type { User } from "next-auth";

interface DecodedToken {
    exp: number;
}

interface RefreshApiResponse {
    tokens?: {
        data?: {
            token?: string;
            user?: User;
        };
    };
}

export async function refreshAccessTokenAction(): Promise<
    | { success: true; accessToken: string; accessTokenExpires: number; user: User }
    | { success: false; message: string }
> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
        const endpoint = `${baseUrl}/api/auth/refresh`;

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        const rawText = await res.text();

        if (!res.ok) {
            try {
                const errorJson = JSON.parse(rawText);
                return { success: false, message: errorJson.message || "Token refresh failed" };
            } catch {
                return { success: false, message: rawText };
            }
        }

        const json: RefreshApiResponse = JSON.parse(rawText);
        const newAccessToken = json.tokens?.data?.token;
        const newUser = json.tokens?.data?.user;

        if (!newAccessToken || !newUser) {
            return { success: false, message: "Missing token or user in response." };
        }

        const decoded = jwtDecode<DecodedToken>(newAccessToken);
        const accessTokenExpires = decoded.exp * 1000;

        return {
            success: true,
            accessToken: newAccessToken,
            accessTokenExpires,
            user: newUser,
        };

    } catch (err: any) {
        return { success: false, message: err?.message || "Unexpected error during token refresh." };
    }
}