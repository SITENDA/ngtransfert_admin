"use client";

import React, {
    useState,
    FormEvent,
    ChangeEvent,
    useRef
} from "react";
import {useLocale, useTranslations} from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/PhoneNumberInput";
import { resetPasswordAction } from "@/lib/actions/resetPasswordAction";
import { useResetPasswordRouter } from "@/app/[locale]/(public_pages)/reset-password/useRouter";

export default function ResetPasswordComponent() {
    const t = useTranslations("ResetPassword");
    const { backToLogin } = useResetPasswordRouter();
    const locale = useLocale();

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [usePhone, setUsePhone] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const phoneInputRef = useRef<HTMLInputElement | null>(null);

    /* ---------------- Phone validation ---------------- */
    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        const digits = value.replace(/\D/g, "");
        setValidPhoneNumber(digits.length >= 10 && digits.length <= 13);
    };

    /* ---------------- Reset password ---------------- */
    const handleReset = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (usePhone && !validPhoneNumber) {
            setError(t("invalidPhoneNumber"));
            phoneInputRef.current?.focus();
            return;
        }

        setLoading(true);

        const result = await resetPasswordAction({
            identifier: usePhone ? "phoneNumber" : "email",
            email: usePhone ? "" : email,
            phoneNumber: usePhone
                ? phoneNumber.startsWith("+")
                    ? phoneNumber
                    : `+${phoneNumber}`
                : "",
            locale,
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

                <form onSubmit={handleReset} className="space-y-4">
                    {/* Email OR Phone */}
                    {!usePhone ? (
                        <Input
                            type="email"
                            placeholder={t("email")}
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    ) : (
                        <PhoneNumberInput
                            value={phoneNumber}
                            changeHandler={handlePhoneChange}
                            validPhoneNumber={validPhoneNumber}
                            ref={phoneInputRef}
                        />
                    )}

                    {/* Toggle */}
                    <button
                        type="button"
                        onClick={() => setUsePhone((v) => !v)}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        {t("use")}{" "}
                        {usePhone ? t("email") : t("phoneNumber")}
                    </button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
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