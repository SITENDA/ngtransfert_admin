//  /home/amos/docure/ngtransfert_admin/src/lib/actions/loginAction.ts

"use server";

interface LoginActionInput {
    identifier: "email" | "phoneNumber";
    email?: string;
    phoneNumber?: string;
    password: string;
}

export async function loginAction(input: LoginActionInput) {

    console.log("Input is : ", input);

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        cache: "no-store",
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return {
            success: false,
            message: error.message || "Invalid credentials",
        };
    }

    const data = await res.json();
    console.log("Parsed loginAction response:", data);

    return {
        success: true,
        user: data.user ?? null,
    };

}
