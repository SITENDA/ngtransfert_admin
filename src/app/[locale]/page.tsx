// app/[locale]/page.tsx
import CarouselSection from "@/components/CarouselSection";
import PublicWrapper from "@/components/PublicWrapper";
import * as React from "react";
import {getTranslations} from "next-intl/server";

// Import a new client component to handle redirection
import AuthRedirector from "@/components/AuthRedirector"; // We will create this

export const metadata = {
    title: "Home Page | NG Transfert",
};

export default async function Home({ }) {
    // We remove the session check and redirect here.
    // This logic will be handled by AuthRedirector on the client-side.

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
            <AuthRedirector>
                <CarouselSection carouselItems={carouselItems} />
            </AuthRedirector>
        </PublicWrapper>
    );
}