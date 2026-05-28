"use client";

import React, {FormEvent, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useRouter} from "@/i18n/navigation";
import {generalPaths, kaasitomaPaths} from "@/util/frontend-paths";
import {PhoneNumberInput} from "@/components/PhoneNumberInput";
import TickAnimation from "@/components/TickAnimation";

export default function RegisterFormComponent() {
    const t = useTranslations("RegisterFormComponent");
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null); // State for displaying form errors
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const locale = useLocale();

    const phoneInputRef = useRef<HTMLInputElement | null>(null);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (password !== confirmPassword) {
            setFormError(t("passwordMismatch"));
            phoneInputRef.current?.focus();
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName,
                identifier: "EMAIL",
                email,
                phoneNumber: phoneNumber.startsWith("+")
                    ? phoneNumber
                    : `+${phoneNumber}`,
                password,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setFormError(
                data.message || t("registrationFailed")
            );
            return;
        }

        setSuccessMessage(t("registrationSuccess"));

        setTimeout(() => {
            router.push(
                generalPaths.fromRegistrationLoginPath
            );
        }, 3000);
    };

    const handleOAuth2Registration = (provider: string): void => {
        const redirectUri = `${window.location.origin}/${locale}/oauth2/redirect`;
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);

        // Basic validation: 10–13 digits (you already describe this in UI)
        const digitsOnly = value.replace(/\D/g, "");
        setValidPhoneNumber(digitsOnly.length >= 10 && digitsOnly.length <= 13);
    };

    if (successMessage) {
        return (
            <TickAnimation successMessage={successMessage} />
        );
    }

    return (
        // Outer div for the entire page background (can be handled by a layout component)
        <div className="flex flex-col items-center justify-center p-4">
            {/* Inner div for the transparent, rounded content container */}
            <div className="
                w-full max-w-sm mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700
                flex flex-col items-center justify-center
            ">
                {formError && (
                    <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-300">
                        <strong>{t("errorPrefix")}:</strong> {formError}
                    </div>
                )}

                {/* ✅ Inputs spaced properly */}
                <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                        placeholder={t("fullName")}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

                    <Input
                        type="email"
                        placeholder={t("email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <PhoneNumberInput
                        value={phoneNumber}
                        changeHandler={handlePhoneChange}
                        validPhoneNumber={validPhoneNumber}
                        ref={phoneInputRef}
                    />

                    <Input
                        type="password"
                        placeholder={t("password")}
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

                    <Button  variant="link" className="text-blue-600 dark:text-blue-400 mb-6 hover:underline" onClick={() => router.push(kaasitomaPaths.loginPath)}
                    >
                        {t("alreadyHaveAccount")}
                    </Button>

                    <Button type="submit" className="w-full">
                        {t("registerButton")}
                    </Button>
                </form>

                {/* ✅ OAuth buttons spaced + scroll-safe */}
                <div className="space-y-3 pt-2">
                    <Button
                        onClick={() => handleOAuth2Registration("google")}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                        {t("signUpWithGoogle")}
                    </Button>

                    <Button
                        onClick={() => handleOAuth2Registration("facebook")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {t("signUpWithFacebook")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
