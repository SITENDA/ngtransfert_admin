import * as React from "react";
import PublicWrapper from "@/components/PublicWrapper";
import ContactUsForm from "@/app/[locale]/(public_pages)/contact/ContactUsForm";
import {useTranslations} from 'next-intl';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Contact Us",
}

export default function ContactUsPage() {

    const t = useTranslations('ContactUsPage');


    return (
        <PublicWrapper>
            <h4 className="text-white text-2xl font-semibold mb-3">
                { t('contactUs')}
            </h4>
            <p className="text-white/80 text-lg bg-[#230a84]/50 p-4 rounded-lg">
                { t('readyToStart')}
            </p>
            <ContactUsForm content = {{
                emailTitle:  t('emailTitle'),
                emailPlaceholder: t('emailPlaceholder'),
                messageTitle: t('messageTitle'),
                messagePlaceholder: t('messagePlaceholder'),
                sendButtonTitle: t('sendButtonTitle'),
                loadingLabel: t('loadingLabel'),
                reset: t('reset')
            }}/>
        </PublicWrapper>

    );
}