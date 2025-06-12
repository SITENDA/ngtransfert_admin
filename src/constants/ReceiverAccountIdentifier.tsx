// src/constants/ReceiverAccountType.ts
"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import solid icons for QR code, phone, and envelope (email)
import { faQrcode, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ReceiverAccountIdentifierEnum } from "@/zod-schemas/receiver-account";
import { ReactNode } from "react";
import { useTranslations } from 'next-intl';

type DataObj = {
    label: string;
    value: string;
    icon?: ReactNode;
};

// Export a function that returns the translated array
export const useReceiverAccountIdentifiers = (): DataObj[] => {
    // Get translations for the 'AddReceiverAccountForm' namespace
    const t = useTranslations('AddReceiverAccountForm');

    return [
        {
            label: t('qrcodeIdentifier'),
            value: ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE,
            // Changed to faQrcode icon
            icon: <FontAwesomeIcon icon={faQrcode} style={{ color: '#07C160' }} />
        },
        {
            label: t('phoneIdentifier'),
            value: ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER,
            // Changed to faPhone icon
            icon: <FontAwesomeIcon icon={faPhone} style={{ color: '#1677FF' }} />
        },
        {
            label: t('emailIdentifier'),
            value: ReceiverAccountIdentifierEnum.enum.EMAIL,
            // Changed to faEnvelope icon
            icon: <FontAwesomeIcon icon={faEnvelope} style={{ color: '#FF4500' }} />
        }
    ];
};