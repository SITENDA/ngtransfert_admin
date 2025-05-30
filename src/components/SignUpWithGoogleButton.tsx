// components/SignUpWithGoogleButton.tsx (example)
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function SignUpWithGoogleButton() {
    const t = useTranslations('HomePage'); // Assuming translations are in HomePage scope

    return (
        <Button onClick={() => signIn('google')}>
            {t('signUpWithGoogle')} {/* You'll need a translation key for this */}
        </Button>
    );
}