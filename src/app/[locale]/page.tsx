import CarouselSection from "@/components/CarouselSection";
import PublicWrapper from "@/components/PublicWrapper";
import * as React from "react";
import {getLocale, getTranslations} from "next-intl/server";
import {auth} from "@/auth";

import { redirect } from "next/navigation";

export const metadata = {
    title: "Home Page | NG Transfert",
};

export default async function Home({ }) {
    const session = await auth();
    const user = session?.user;
    const locale = await getLocale() // Get the current locale

    console.log("User is : ", user);

    if (user) {
        // Redirect to the dashboard with the current locale
        redirect(`/${locale}/dashboard`);
        return null;
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
            <CarouselSection carouselItems={carouselItems} />
            <p className="mt-6 text-sm text-white">
                <span className="italic">{t('newAtNGTransfert')}</span><br />
            </p>
        </PublicWrapper>
    );
}