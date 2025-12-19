"use client";

import React, { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { kaasitomaPaths } from "@/util/frontend-paths";
import { resetPasswordFormAction } from "@/lib/actions/resetPasswordFormAction";
import TickAnimation from "@/components/TickAnimation";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordFormComponent() {
    const t = useTranslations("ResetPasswordForm");
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    if (!token) {
        return (
            <div className="text-center text-red-600">
                {t("invalidLink")}
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (password !== confirmPassword) {
            setFormError(t("passwordMismatch"));
            return;
        }

        setLoading(true);

        const res = await resetPasswordFormAction({
            token,
            newPassword: password,
        });

        setLoading(false);

        if (!res.success) {
            setFormError(res.message || t("resetFailed"));
            return;
        }

        // ✅ Success UX
        toast({
            title: t("successTitle"),
            description: t("resetSuccess"),
        });

        setSuccessMessage(t("resetSuccess"));

        setTimeout(() => {
            router.push(kaasitomaPaths.loginPath);
        }, 3000);
    };

    // ✅ Show success animation ONLY
    if (successMessage) {
        return <TickAnimation successMessage={successMessage} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
            {formError && (
                <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    <strong>{t("errorPrefix")}:</strong> {formError}
                </div>
            )}

            <Input
                type="password"
                placeholder={t("newPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <Input
                type="password"
                placeholder={t("confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("submitting") : t("submitButton")}
            </Button>
        </form>
    );
}
