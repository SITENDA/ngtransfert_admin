// src/lib/actions/topUpAccountBalanceAction.ts
"use server";

import getSession from "@/lib/getSession";
import {cookies} from "next/headers";

export async function topUpAccountBalanceAction(formData: FormData) {
    try {
        const session = await getSession();

        // ✅ Session-only authentication
        if (!session) {
            return {
                success: false,
                message: "Authentication required.",
            };
        }

        // ✅ Extract cookies from current request
        const cookieHeader = (await cookies())
            .getAll()
            .map(c => `${c.name}=${c.value}`)
            .join("; ");

        const proxyApiUrl =
            `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/topUp/topUpAccountBalance`;

        const response = await fetch(proxyApiUrl, {
            method: "POST",
            body: formData,
            headers: {
                Cookie: cookieHeader, // 🔥 THIS IS THE KEY
            },
        });

        const text = await response.text();
        let data: any = null;

        try {
            data = JSON.parse(text);
        } catch {
            console.error("TopUpAction: Non-JSON response:", text);
        }

        if (!response.ok) {
            return {
                success: false,
                message: data?.message ?? "Top-up failed.",
            };
        }

        return {
            success: true,
            message: "Top-up completed successfully!",
            data,
        };

    } catch (error) {
        console.error("TopUpAction: Unexpected error:", error);
        return {
            success: false,
            message: "An unexpected error occurred.",
        };
    }
}
