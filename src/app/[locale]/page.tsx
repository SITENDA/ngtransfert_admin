// app/[locale]/page.tsx
import CarouselSection from "@/components/CarouselSection";
import PublicWrapper from "@/components/PublicWrapper";
import * as React from "react";
import {getTranslations, getLocale} from "next-intl/server"; // <--- Import getLocale
import getSession from "@/lib/getSession";

// Import a new client component to handle redirection
import AuthRedirector from "@/components/AuthRedirector";
import {redirect} from "next/navigation";

export const metadata = {
    title: "Home Page | NG Transfert",
};

export default async function Home({ }) {
    // Get the locale from next-intl/server
    const locale = await getLocale(); // <--- Define locale here

    const session = await getSession();
    const user = session?.user;

    // Use the defined locale in the redirect
    if (user?.ekiddako) {
        redirect(`/${locale}/${user?.ekiddako}`);
    }

    const t = await getTranslations('HomePage');

    const carouselItems = [
        {
            title: t('carouselTitle-1'),
            description: t('carouselDescription-1'),
        },
        {
            title: t('carouselTitle-2'),
            description: t('carouselDescription-2'),
        },
    ];

    return (
        <PublicWrapper>
            {/* Render the client component responsible for auth checking and redirection */}
            {/* You might want to pass the locale to AuthRedirector if it needs it */}
            <AuthRedirector>
                <CarouselSection carouselItems={carouselItems} />
            </AuthRedirector>
        </PublicWrapper>
    );
}