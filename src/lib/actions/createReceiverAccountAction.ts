// src/lib/actions/createReceiverAccountAction.ts
"use server";

import { cookies, headers } from "next/headers";
import getSession from "@/lib/getSession";

export async function createReceiverAccountAction(
    formData: FormData
) {
    console.log("createReceiverAccountAction called");

    const session = await getSession();

    if (!session) {
        return {
            success: false,
            message: "Authentication required.",
        };
    }

    try {
        // 🔥 Build internal BFF URL dynamically
        const headersList = await headers();

        const protocol =
            headersList.get("x-forwarded-proto") ?? "http";

        const host = headersList.get("host");

        if (!host) {
            throw new Error("Host header missing");
        }

        const apiUrl =
            `${protocol}://${host}/api/kaasitoma/receiverAccounts/createReceiverAccount`;

        // 🔥 Forward cookies to BFF
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

        let data = null;

        try {
            data = JSON.parse(text);
        } catch {
            console.error(
                "Failed to parse createReceiverAccount response:",
                text
            );
        }

        if (!response.ok) {
            return {
                success: false,
                message:
                    data?.message ??
                    "Failed to create receiver account",
            };
        }

        return {
            success: true,
            message:
                data?.message ??
                "Receiver account created successfully!",
            data,
        };
    } catch (error) {
        console.error(
            "createReceiverAccountAction error:",
            error
        );

        return {
            success: false,
            message:
                "An unexpected error occurred while creating the receiver account.",
        };
    }
}