"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { ComponentProps } from "react";

type SignOutButtonProps = {
    variant?: ComponentProps<typeof Button>["variant"];
    size?: ComponentProps<typeof Button>["size"];
    className?: string;
};

export default function SignOutButton({
                                          variant = "ghost",
                                          size = "icon",
                                          className,
                                      }: SignOutButtonProps) {
    const t = useTranslations("SignOutButton");
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleConfirmLogout = async () => {
        setOpen(false);

        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        router.replace("/");
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant={variant}
                size={size}
                className={className}
                title={t("logout")}
                type="button"
            >
                <LogOut className="h-5 w-5" />
            </Button>

            <ConfirmDialog
                open={open}
                title={t("logout")}
                message={t("logoutConfirmation")}
                confirmLabel={t("confirm")}
                cancelLabel={t("cancel")}
                onConfirmAction={handleConfirmLogout}
                onCancelAction={() => setOpen(false)}
            />
        </>
    );
}