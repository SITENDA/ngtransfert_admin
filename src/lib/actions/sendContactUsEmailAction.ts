// src/lib/actions/sendContactUsMessageAction.ts
"use server";

import { contactUsSchema } from "@/zod-schemas/contact-us";
import { ContactPayload } from "../../../types/ContactPayload";

export async function sendContactUsMessageAction(input: ContactPayload) {

    const parsed = contactUsSchema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            formErrors: ["Invalid form data"],
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/contact`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            cache: "no-store",
        }
    );

    let json;
    try {
        json = await res.json();
    } catch {
        return {
            success: false,
            formErrors: ["Unexpected server response"],
        };
    }

    if (!res.ok) {
        return {
            success: false,
            formErrors: [json.message ?? "Failed to send message"],
        };
    }

    return {
        success: true,
        message: json.message,
    };
}
