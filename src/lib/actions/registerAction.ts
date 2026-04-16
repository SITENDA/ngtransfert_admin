// src/lib/actions/registerAction.ts
"use server";

interface RegisterActionInput {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export async function registerAction(input: RegisterActionInput) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`,
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
            message: error.message || "Registration failed",
        };
    }

    return {
        success: true,
    };
}
