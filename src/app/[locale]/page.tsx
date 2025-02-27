import CarouselSection from "@/components/CarouselSection";
import PublicWrapper from "@/components/PublicWrapper";
import * as React from "react";
import {useTranslations} from 'next-intl';
// import {Link} from '@/i18n/routing';
// import Link from "next/link";

export const metadata = {
    title: "Home Page | NG Transfert",
}

export default function Home() {
    const t = useTranslations('HomePage');

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
            <CarouselSection carouselItems={carouselItems}/>
            <p className="mt-6 text-sm text-white">
                <span className="italic">{ t('newAtNGTransfert')}</span><br/>
                {/*<Link href="/register" className="text-blue-400 hover:underline text-base">*/}
                {/*    Register*/}
                {/*</Link>*/}
                {/* <RegisterLink>Register</RegisterLink> */}
            </p>
        </PublicWrapper>

    );
}