// app/[locale]/page.tsx
import * as React from "react";
import {getTranslations, getLocale} from "next-intl/server";
import {redirect} from "next/navigation";

import getSession from "@/lib/getSession";
import PublicWrapper from "@/components/PublicWrapper";
import CarouselSection from "@/components/CarouselSection";
import AuthRedirector from "@/components/AuthRedirector";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Home Page | NG Transfert",
};

export default async function Home() {
    const locale = await getLocale();
    const t = await getTranslations("HomePage");

    const session = await getSession();
    const user = session?.user;

    // Redirect logged-in users
    if (user?.ekiddako) {
        redirect(`/${locale}/${user.ekiddako}`);
    }

    const carouselItems = [
        {
            title: t("carouselTitle-1"),
            description: t("carouselDescription-1"),
        },
        {
            title: t("carouselTitle-2"),
            description: t("carouselDescription-2"),
        },
    ];

    return (
        <PublicWrapper>
            <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl">
                <AuthRedirector>
                    <CarouselSection carouselItems={carouselItems}/>
                </AuthRedirector>
            </div>
        </PublicWrapper>
    );
}
