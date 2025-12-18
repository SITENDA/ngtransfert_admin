"use client";

import React, { useState, FormEvent, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/PhoneNumberInput";
import { useRouter } from "@/i18n/navigation";
import {generalPaths, kaasitomaPaths} from "@/util/frontend-paths";

export default function LoginFormComponent() {
    const t = useTranslations("LoginFormComponent");
    const router = useRouter();
    const locale = useLocale();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [password, setPassword] = useState("");
    const [loginWithPhone, setLoginWithPhone] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const phoneInputRef = useRef<HTMLInputElement | null>(null);

    /* ---------------- OAuth error handling ---------------- */
    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam) {
            setFormError(t("oauthError"));

            const params = new URLSearchParams(searchParams.toString());
            params.delete("error");

            router.replace(`/${generalPaths.loginPath}/?${params.toString()}`, {
                scroll: false,
            });
        }
    }, [searchParams, t, router]);

    /* ---------------- Phone validation ---------------- */
    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        const digits = value.replace(/\D/g, "");
        setValidPhoneNumber(digits.length >= 10 && digits.length <= 13);
    };

    /* ---------------- Login ---------------- */
    const handleManualLogin = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (loginWithPhone && !validPhoneNumber) {
            setFormError(t("invalidPhoneNumber"));
            phoneInputRef.current?.focus();
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: loginWithPhone ? "phoneNumber" : "email",
                    email: loginWithPhone ? "" : email,
                    phoneNumber: loginWithPhone ? phoneNumber.startsWith("+")
                            ? phoneNumber
                            : `+${phoneNumber}`
                        : "",
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success || !data.user?.ekiddako) {
                setFormError(t("loginFailed"));
                return;
            }

            // ✅ Redirect based on role (ekiddako)
            router.push(`/${data.user.ekiddako}`);
        } catch (err) {
            console.error("Login error:", err);
            setFormError(t("loginFailed"));
        }
    };

    /* ---------------- OAuth ---------------- */
    const handleOAuth2Login = (provider: string) => {
        const redirectUri = `${window.location.origin}/${locale}/oauth2/redirect`;
        const oauth2Url = `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
        }/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(
            redirectUri
        )}`;

        window.location.href = oauth2Url;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm mx-auto my-8 p-6 rounded-lg shadow-xl bg-background/80 backdrop-blur-sm border border-border dark:bg-gray-800/80 dark:border-gray-700">
                {formError && (
                    <div className="mb-4 rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-300">
                        <strong>{t("errorPrefix")}:</strong> {formError}
                    </div>
                )}

                <form onSubmit={handleManualLogin} className="space-y-4">
                    {/* Email OR Phone */}
                    {!loginWithPhone ? (
                        <Input
                            type="email"
                            placeholder={t("emailLabel")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        onClick={() => setLoginWithPhone((v) => !v)}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        {t("loginWith")}{" "}
                        {loginWithPhone
                            ? t("emailLabel").toLowerCase()
                            : t("phoneNumberLabel").toLowerCase()}
                    </button>

                    {/* Password */}
                    <Input
                        type="password"
                        placeholder={t("passwordLabel")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* Forgot password */}
                    <div className="text-right text-sm">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(kaasitomaPaths.resetPasswordPath)
                            }
                            className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {t("forgotPassword")}
                        </button>
                    </div>

                    <Button type="submit" className="w-full">
                        {t("signInButton")}
                    </Button>
                </form>

                {/* Register */}
                <Button
                    variant="link"
                    className="mt-4 text-blue-600 dark:text-blue-400"
                    onClick={() => router.push(kaasitomaPaths.registerPath)}
                >
                    {t("needAccount")}
                </Button>

                {/* OAuth */}
                <div className="mt-4 space-y-3">
                    <Button
                        onClick={() => handleOAuth2Login("google")}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                        {t("loginWithGoogle")}
                    </Button>
                    <Button
                        onClick={() => handleOAuth2Login("facebook")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {t("loginWithFacebook")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
