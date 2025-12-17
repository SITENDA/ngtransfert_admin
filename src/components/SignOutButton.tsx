"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
    variant?: "default" | "destructive";
    size?: "sm" | "default";
    color?: "default" | "red";
}

export default function SignOutButton({
                                          variant = "default",
                                          size = "default",
                                          color = "default",
                                      }: SignOutButtonProps) {
    const t = useTranslations("Settings");
    const router = useRouter();

    const handleSignOut = async () => {
        const confirmed = window.confirm(t("logoutConfirmation"));
        if (!confirmed) return;

        // 🔐 Call BFF logout endpoint
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include", // IMPORTANT: send HttpOnly cookie
        });

        // 🚪 Redirect after logout
        router.replace("/");
    };

    const customClass =
        color === "red"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "";

    return (
        <Button
            onClick={handleSignOut}
            variant={variant}
            size={size}
            className={customClass}
        >
            {t("logout")}
        </Button>
    );
}
