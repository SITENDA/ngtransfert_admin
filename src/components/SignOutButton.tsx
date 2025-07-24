"use client";

import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  variant?: "default" | "destructive";
  size?: "sm" | "default";
  color?: "default" | "red";
}

export default function SignOutButton({
                                        variant = "default",
                                        size = "default",
                                        color = "default"
                                      }: SignOutButtonProps) {
  const t = useTranslations("Settings");

  const handleSignOut = () => {
    const confirmed = window.confirm(t("logoutConfirmation"));
    if (confirmed) {
      signOut();
    }
  };

  const customClass = color === "red" ? "bg-red-600 text-white hover:bg-red-700" : "";

  return (
      <Button onClick={handleSignOut} variant={variant} size={size} className={customClass}>
        {t("logout")}
      </Button>
  );
}