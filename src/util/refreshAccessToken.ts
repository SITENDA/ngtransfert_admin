import { jwtDecode } from "jwt-decode";
import { headers } from "next/headers";
import type { User } from "next-auth";
import {ErrorBody} from "../../types/BackendHttpResponse";

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


export type RefreshTokenPayload = {
    accessToken: string;
    accessTokenExpires: number;
    user: User;
} | { error : string };

export async function refreshAccessToken(): Promise<RefreshTokenPayload> {
    try {
        const headersList = await headers();
        const cookieHeader = headersList.get("cookie");
        const host = headersList.get("host") || "localhost:3000";

        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        const refreshEndpoint = `${protocol}://${host}/api/auth/refresh`;

        const response = await fetch(refreshEndpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
        });

        if (response.status === 204) {
            console.warn("User is logged out (204 response from backend).");
            return { error: "SignedOut" };
        }

        if (!response.ok) {
            const errorBody: ErrorBody = await response.json().catch(() => ({
                message: "Error parsing refresh response",
            }));
            console.error("Refresh failed:", errorBody);
            return { error: "RefreshAccessTokenError" };
        }

        const refreshData: RefreshApiResponse = await response.json();
        console.log("Refresh data is : ", refreshData)
        const newAccessToken = refreshData.tokens?.data?.token;
        const newUser = refreshData.tokens?.data?.user;

        if (!newAccessToken || !newUser) {
            console.error("Invalid refresh response structure");
            return { error: "InvalidRefreshResponse" };
        }

        const decoded = jwtDecode<DecodedToken>(newAccessToken);

        return {
            accessToken: newAccessToken,
            accessTokenExpires: decoded.exp * 1000,
            user: newUser,
        };
    } catch (err) {
        console.error("Error refreshing token:", err);
        return { error: "RefreshAccessTokenError" };
    }
}
