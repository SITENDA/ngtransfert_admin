"use server";


import {NewPassword} from "../../../types/NewPassword";

export async function resetPasswordFormAction(input: NewPassword) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/reset-password-form`,
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
            message: error.message || "Password reset failed",
        };
    }

    return {
        success: true,
    };
}
