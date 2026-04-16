"use client";

import React, {
    useState,
    FormEvent,
    ChangeEvent,
    useRef,
    useEffect
} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {PhoneNumberInput} from "@/components/PhoneNumberInput";
import {resetPasswordAction} from "@/lib/actions/resetPasswordAction";
import {useResetPasswordRouter} from "@/app/[locale]/(public_pages)/reset-password/useRouter";
import {CheckCircle} from "lucide-react";

export default function ResetPasswordComponent() {
    const t = useTranslations("ResetPassword");
    const {backToLogin} = useResetPasswordRouter();
    const locale = useLocale();

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [usePhone, setUsePhone] = useState(false);
    const [sentTo, setSentTo] = useState<string | null>(null);


    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const phoneInputRef = useRef<HTMLInputElement | null>(null);
    const successTimerRef = useRef<NodeJS.Timeout | null>(null);

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

        setLoading(false);

        if (!result.success) {
            setError(t("resetFailed"));
            return;
        }

        // ✅ SUCCESS UX (same behavior as ResetPasswordFormComponent)
        setSentTo(usePhone ? phoneNumber : email);
        setShowSuccess(true);


        successTimerRef.current = setTimeout(() => {
            setShowSuccess(false);
        }, 10000);
    };

    /* ---------------- Cleanup timer ---------------- */
    useEffect(() => {
        return () => {
            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* ✅ SUCCESS TOAST */}
            {showSuccess && (
                <div className="
                    fixed bottom-6 right-6 z-50
                    flex items-center gap-3
                    bg-green-600 text-white
                    px-5 py-4 rounded-xl shadow-lg
                    animate-in fade-in slide-in-from-bottom-4
                ">
                    <CheckCircle className="w-6 h-6 animate-bounce"/>
                    <span className="font-medium">
                        {t("resetLinkDescription", { email: sentTo })}
                    </span>
                </div>
            )}

            <div className="flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm p-6 rounded-lg shadow-xl
                    bg-background/80 backdrop-blur-sm border border-border
                    dark:bg-gray-800/80 dark:border-gray-700">

                    {error && (
                        <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {showSuccess && sentTo && (
                        <div className="
                                mb-6 w-full max-w-sm
                                rounded-2xl border border-green-300
                                bg-green-100/80 dark:bg-green-900/40
                                p-5 text-green-800 dark:text-green-200
                                shadow-lg backdrop-blur
                                animate-in fade-in zoom-in-95
                              ">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="mt-1 h-6 w-6 text-green-600 dark:text-green-400"/>
                                <div>
                                    <p className="font-semibold text-base">
                                        {t("resetLinkTitle")}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed">
                                        {t("resetLinkDescription", {email: sentTo})}
                                    </p>
                                </div>
                            </div>
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
        </>
    );
}
