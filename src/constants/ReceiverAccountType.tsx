// src/constants/ReceiverAccountType.ts
"use client"; // This constant needs to be a client-side module to use useTranslations

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin, faAlipay } from '@fortawesome/free-brands-svg-icons';  // WeChat and Alipay icons
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { ReceiverAccountCategoryEnum } from "@/zod-schemas/receiver-account";
import { ReactNode } from "react";
import { useTranslations } from 'next-intl'; // Import useTranslations

type DataObj = {
    label: string;
    value: string;
    icon?: ReactNode;
};

// Export a function that returns the translated array
export const useOrderedReceiverAccountCategories = (): DataObj[] => {
    // Get translations for the 'AddReceiverAccountForm' namespace
    const t = useTranslations('AddReceiverAccountForm');

    return [
        {
            label: t('wechat'), // Translated label
            value: ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
            icon: <FontAwesomeIcon icon={faWeixin} style={{ color: '#07C160' }} />
        },
        {
            label: t('alipay'), // Translated label
            value: ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT,
            icon: <FontAwesomeIcon icon={faAlipay} style={{ color: '#1677FF' }} />
        },
        {
            label: t('bank'), // Translated label
            value: ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT,
            icon: <FontAwesomeIcon icon={faUniversity} style={{ color: '#FF4500' }} />
        }
    ];
};