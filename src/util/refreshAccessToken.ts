import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number;
}

export async function refreshAccessToken(): Promise<any> {
    try {
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        const host = process.env.NEXTAUTH_URL || 'localhost:3000';
        const refreshEndpoint = `${protocol}://${host}/api/auth/refresh`;

        const response = await fetch(refreshEndpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 204) {
            console.warn("User is logged out (204 response from backend).");
            return { error: "SignedOut" }; // ⛔️ Do NOT return old token
        }

        if (!response.ok) {
            console.error("Refresh token request failed:", response.statusText);
            return { error: "RefreshAccessTokenError" };
        }

        const refreshData = await response.json();

        const newAccessToken = refreshData.tokens?.data?.token;
        const newUser = refreshData.tokens?.data?.user;

        if (!newAccessToken || !newUser) {
            console.error("Invalid refresh response structure");
            return { error: "InvalidRefreshResponse" }; // ⛔️ Do NOT return old token
        }

        return {
            accessToken: newAccessToken,
            accessTokenExpires: jwtDecode<DecodedToken>(newAccessToken).exp * 1000,
            ...newUser
        };

    } catch (err) {
        console.error("Error refreshing token:", err);
        return { error: "RefreshAccessTokenError" }; // ⛔️ Do NOT return old token
    }
}