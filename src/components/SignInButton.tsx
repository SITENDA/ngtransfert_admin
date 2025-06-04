// components/SignInButton.tsx
"use client";

import Link from "next/link"; // Used for client-side navigation
import { Button } from "@/components/ui/button"; // Assuming you have your UI button component here
import { useTranslations, useLocale } from 'next-intl'; // Import useTranslations AND useLocale hook

/**
 * Renders a button that navigates the user to the login/registration page.
 * The button text and the link path are translated/locale-aware using next-intl.
 */
const SignInButton = () => {
  // Get the translation function for the 'Common' namespace
  const t = useTranslations('HomePage');
  // Get the current locale from next-intl
  const locale = useLocale();

  return (
      // The `Button` component wraps a `Link` component, allowing Next.js client-side navigation.
      // `asChild` prop means the Button will render its child (the Link) without wrapping it in an extra DOM element.
      <Button asChild className="px-6 py-3 text-lg font-bold">
        {/* Construct the href dynamically with the current locale */}
        <Link href={`/${locale}/login`}>{t('signIn')}</Link>
      </Button>
  );
};

export default SignInButton; // Export the component as a default export