// src/lib/server/forceLogout.ts
export async function forceLogout() {
    const protocol = "https";
    const host = process.env.NEXT_PUBLIC_APP_HOST || "localhost:3000";

    await fetch(`${protocol}://${host}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    })
}

