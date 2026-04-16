// src/lib/actions/createReceiverAccountAction.ts
"use server";

import { cookies } from "next/headers";
import getSession from "@/lib/getSession";

export async function createReceiverAccountAction(formData: FormData) {
    console.log("createReceiverAccountAction called");

    const session = await getSession();
    if (!session) {
        return { success: false, message: "Authentication required." };
    }

    // ✅ Extract cookies from current request
    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const proxyApiUrl =
        `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/receiverAccounts/createReceiverAccount`;

    const response = await fetch(proxyApiUrl, {
        method: "POST",
        body: formData,
        headers: {
            Cookie: cookieHeader, // 🔥 THIS IS THE KEY
        },
    });

    const text = await response.text();
    let data = null;

    try {
        data = JSON.parse(text);
    } catch {}

    if (!response.ok) {
        return {
            success: false,
            message: data?.message ?? "Failed to create receiver account",
        };
    }

    return {
        success: true,
        message: "Receiver account created successfully!",
        data,
    };
}

