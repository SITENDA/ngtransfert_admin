// components/ResetPasswordComponent.tsx
"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "@/lib/actions/resetPasswordAction";
import {useResetPasswordRouter} from "@/app/[locale]/(public_pages)/reset-password/useRouter";

export default function ResetPasswordComponent() {
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [usePhone, setUsePhone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const t = useTranslations("ResetPassword");
    const { backToLogin } = useResetPasswordRouter();

    const handleReset = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const result = await resetPasswordAction({
            identifier: usePhone ? "phoneNumber" : "email",
            email,
            phoneNumber,
        });

        if (!result.success) {
            setError(t("resetFailed"));
        } else {
            setSuccess(t("resetSuccess"));
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm p-6 rounded-lg shadow-xl
        bg-background/80 backdrop-blur-sm border border-border
        dark:bg-gray-800/80 dark:border-gray-700">

                {error && (
                    <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-sm text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                <form onSubmit={handleReset}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">
                            {usePhone ? t("phoneNumber") : t("email")}
                        </label>
                        <Input
                            type={usePhone ? "tel" : "email"}
                            value={usePhone ? phoneNumber : email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                usePhone
                                    ? setPhoneNumber(e.target.value)
                                    : setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setUsePhone(prev => !prev)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
                    >
                        {t("use")} {usePhone ? t("email") : t("phoneNumber")}
                    </button>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? t("sending") : t("resetButton")}
                    </Button>
                </form>

                <Button
                    variant="link"
                    className="w-full mt-4"
                    onClick={backToLogin}
                >
                    {t("backToLogin")}
                </Button>
            </div>
        </div>
    );
}
