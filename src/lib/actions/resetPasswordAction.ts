// src/lib/actions/resetPasswordAction.ts
"use server";

interface ResetPasswordActionInput {
    identifier: "email" | "phoneNumber";
    email?: string;
    phoneNumber?: string;
}

export async function resetPasswordAction(input: ResetPasswordActionInput) {
    console.log("ResetPasswordAction input:", input);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/resetPassword`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            cache: "no-store",
        }
    );

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return {
            success: false,
            message: error.message || "Reset password failed",
        };
    }

    const data = await res.json();

    return {
        success: true,
        message: data.message ?? null,
    };
}
