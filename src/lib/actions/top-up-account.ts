"use server";

import getSession from "@/lib/getSession";

export async function topUpAccountBalanceAction(formData: FormData) {
    try {
        const session = await getSession();

        // ✅ ONLY check session existence
        if (!session) {
            console.error("Server Action: Authentication failed. No active session.");
            return {
                success: false,
                message: "Authentication required."
            };
        }

        const proxyApiUrl =
            `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/topUp/topUpAccountBalance`;

        const response = await fetch(proxyApiUrl, {
            method: "POST",
            body: formData,
            // ❌ NO Authorization header
            // ❌ NO token handling here
        });

        const responseText = await response.text();

        let responseData: any = null;
        try {
            responseData = responseText ? JSON.parse(responseText) : null;
        } catch {
            console.error("Server Action: Non-JSON response:", responseText);
        }

        if (!response.ok) {
            console.error(
                `Server Action: API proxy failed (${response.status})`,
                responseData
            );
            return {
                success: false,
                message:
                    responseData?.message ||
                    "Top-up failed."
            };
        }

        return {
            success: true,
            message: "Top-up completed successfully!",
            data: responseData
        };

    } catch (error) {
        console.error("Server Action: Unexpected error:", error);
        return {
            success: false,
            message: "An unexpected error occurred."
        };
    }
}
