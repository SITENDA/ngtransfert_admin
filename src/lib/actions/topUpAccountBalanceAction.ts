// src/lib/actions/topUpAccountBalanceAction.ts
"use server";

import getSession from "@/lib/getSession";
import { cookies, headers } from "next/headers";

export async function topUpAccountBalanceAction(
    formData: FormData
) {
    try {
        const session = await getSession();

        // ✅ Session-only authentication
        if (!session) {
            return {
                success: false,
                message: "Authentication required.",
            };
        }

        // ✅ Dynamically detect protocol + host
        const headersList = await headers();

        const protocol =
            headersList.get("x-forwarded-proto") ?? "http";

        const host = headersList.get("host");

        if (!host) {
            throw new Error("Host header missing");
        }

        // ✅ Internal BFF URL
        const apiUrl =
            `${protocol}://${host}/api/kaasitoma/topUp/topUpAccountBalance`;

        // ✅ Forward cookies
        const cookieHeader = (await cookies())
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");

        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        });

        const text = await response.text();

        let data: any = null;

        try {
            data = JSON.parse(text);
        } catch {
            console.error(
                "Failed to parse top-up response:",
                text
            );
        }

        if (!response.ok) {
            return {
                success: false,
                message:
                    data?.message ?? "Top-up failed.",
            };
        }

        return {
            success: true,
            message:
                data?.message ??
                "Top-up completed successfully!",
            data,
        };

    } catch (error) {
        console.error(
            "topUpAccountBalanceAction error:",
            error
        );

        return {
            success: false,
            message:
                "An unexpected error occurred.",
        };
    }
}