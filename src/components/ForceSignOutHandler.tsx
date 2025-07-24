//  ForceSignOutHandler.tsx
"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function ForceSignOutHandler() {
    useEffect(() => {
        signOut({ redirect: false }).catch((err) =>
            console.error("Failed to sign out forcibly:", err)
        );
    }, []);

    return null;
}
