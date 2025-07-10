// components/SignInButton.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation'; // <-- Import usePathname for client-side path access

/**
 * Props for SignInButton component.
 * @param {string | undefined | null} hideOnPathSegment - If the current client-side path contains this segment, the button will not render.
 */
interface SignInButtonProps {
    hideOnPathSegment?: string | null;
}

const SignInButton = ({ hideOnPathSegment }: SignInButtonProps) => {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const pathname = usePathname(); // Get the current client-side URL pathname
    const router = useRouter();

    // Check if `hideOnPathSegment` is provided and is a non-empty string,
    // AND if the current pathname includes that segment.
    if (hideOnPathSegment && pathname.includes(hideOnPathSegment)) {
        router.refresh();
    }

    return (
        <Button asChild className="px-6 py-3 text-lg font-bold">
            {/* Construct the href dynamically with the current locale */}
            <Link href={`/${locale}/login`}>{t('signIn')}</Link>
        </Button>
    );
};

export default SignInButton;