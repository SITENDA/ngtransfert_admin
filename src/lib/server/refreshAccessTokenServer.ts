// //  /home/amos/docure/ngtransfert_admin/src/lib/server/refreshAccessTokenServer.ts


import {RefreshTokenResult} from "../../../types/RefreshTokenResult";

interface RefreshApiResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number; // seconds
}

export async function refreshAccessTokenServer(
    refreshToken: string
): Promise<RefreshTokenResult> {
    const backendUrl = process.env.BACKEND_API_BASE_URL || "http://localhost:8080";
    const refreshUrl = `${backendUrl}/auth/refresh`;

    try {
        const response = await fetch(refreshUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
            cache: "no-store",
        });

        if (!response.ok) {
            const text = await response.text();
            return {
                success: false,
                accessToken: "",
                expiresAt: 0,
            };
        }

        const json: RefreshApiResponse = await response.json();

        return {
            success: true,
            accessToken: json.accessToken,
            refreshToken: json.refreshToken,
            expiresAt: Date.now() + json.expiresIn * 1000,
        };
    } catch (error) {
        console.error("Token refresh error:", error);
        return {
            success: false,
            accessToken: "",
            expiresAt: 0,
        };
    }
}

//
// import { headers } from "next/headers";
// import { jwtDecode } from "jwt-decode";
// import type { User } from "next-auth";
//
// interface DecodedToken {
//     exp: number;
// }
//
// interface RefreshApiResponse {
//     data?: {
//         token?: string;
//         user?: User;
//     };
// }
//
// export type RefreshResult =
//     | { success: true; accessToken: string; accessTokenExpires: number; user: User }
//     | { success: false; message: string };
//
// export async function refreshAccessTokenServer(): Promise<RefreshResult> {
//     const headersList = await headers();
//     const cookie = headersList.get("cookie");
//     console.log("refreshAccessTokenServer called");
//
//     const backendUrl = process.env.BACKEND_API_BASE_URL || "http://localhost:8080";
//     const refreshUrl = `${backendUrl}/auth/refresh`;
//
//     try {
//         const response = await fetch(refreshUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 ...(cookie ? { Cookie: cookie } : {}),
//             },
//             cache: "no-store",
//         });
//
//         const bodyText = await response.text();
//
//         if (!response.ok) {
//             try {
//                 const errorJson = JSON.parse(bodyText);
//                 return { success: false, message: errorJson.message || "Refresh failed" };
//             } catch {
//                 return { success: false, message: bodyText };
//             }
//         }
//
//         const json: RefreshApiResponse = JSON.parse(bodyText);
//         const token = json.data?.token;
//         const user = json.data?.user;
//
//         if (!token || !user) {
//             return { success: false, message: "Token or user missing from backend response" };
//         }
//
//         const decoded = jwtDecode<DecodedToken>(token);
//         return {
//             success: true,
//             accessToken: token,
//             accessTokenExpires: decoded.exp * 1000,
//             user,
//         };
//     } catch (error: any) {
//         console.error("Token refresh error:", error);
//         return { success: false, message: error?.message || "Unexpected error" };
//     }
// }
