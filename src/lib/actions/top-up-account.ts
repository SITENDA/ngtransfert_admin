"use server";

import getSession from "@/lib/getSession";
import {JWT} from "next-auth/jwt";

export async function topUpAccountBalanceAction(formData: FormData) {
    try {
        const session = await getSession();

        if (!session || !session.accessToken) {
            console.error("Server Action: Authentication failed. Session or Access Token missing.");
            return { success: false, message: "Authentication required to details account." };
        }
        const tokenObject: JWT = session.accessToken;
        const accessToken = tokenObject.accessToken;
        console.log("Server Action: Using Access Token from session:", accessToken.substring(0, 10) + '...');

        const proxyApiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/topUp/topUpAccountBalance`;

        const response = await fetch(proxyApiUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                // Content-Type is set automatically for FormData
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`Server Action: API proxy returned status ${response.status}:`, responseData);
            return { success: false, message: responseData.message || "Top-up failed." };
        }

        console.log("Server Action: Top-up successful via proxy.", responseData);
        return { success: true, message: "Top-up completed successfully!", data: responseData };

    } catch (error) {
        console.error("Server Action: Unexpected error:", error);
        return { success: false, message: "An unexpected error occurred during details." };
    }
}
