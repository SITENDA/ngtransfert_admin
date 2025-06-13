// src/app/[locale]/(protected_pages)/kaasitoma/receiver-account-details/ReceiverAccountDetailsForm.tsx
"use client"; // This is a Client Component as it uses React hooks and next-intl

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

// Import necessary types
// Import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin, faAlipay } from '@fortawesome/free-brands-svg-icons'; // WeChat and Alipay icons
import { faUniversity } from '@fortawesome/free-solid-svg-icons'; // Bank icon

// Import CountryFlag component (assuming it's a shared component)
import CountryFlag from '@/components/CountryFlag';
import {ReceiverAccount} from "../../../../../../../types/receiver-account";


// Define props for the ReceiverAccountDetailsForm
interface ReceiverAccountDetailsFormProps {
    receiverAccount: ReceiverAccount;
}

const ReceiverAccountDetailsForm: React.FC<ReceiverAccountDetailsFormProps> = ({ receiverAccount }) => {
    // Initialize translations for the component's namespace
    const t = useTranslations('ReceiverAccountDetailsPage');
    // Get the current locale for date formatting
    const locale = useLocale();

    // Helper function to get the appropriate icon for a receiver account category
    const getCategoryIcon = (category: ReceiverAccount['receiverAccountCategory']) => {
        switch (category) {
            case 'ALIPAY_ACCOUNT':
                return <FontAwesomeIcon icon={faAlipay} style={{ color: '#1677FF', fontSize: '1.5em' }} />;
            case 'WECHAT_ACCOUNT':
                return <FontAwesomeIcon icon={faWeixin} style={{ color: '#07C160', fontSize: '1.5em' }} />;
            case 'BANK_ACCOUNT':
                return <FontAwesomeIcon icon={faUniversity} style={{ color: '#FF4500', fontSize: '1.5em' }} />;
            default:
                return null;
        }
    };

    // Helper function to display the identifier value based on its type
    const getIdentifierValue = (account: ReceiverAccount) => {
        switch (account.receiverAccountIdentifier) {
            case 'EMAIL':
                return account.email || t('notApplicable');
            case 'PHONE_NUMBER':
                return account.phoneNumber || t('notApplicable');
            case 'QR_CODE_IMAGE':
                return account.qrCodeImageUrl ? (
                    <a href={account.qrCodeImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {t('viewQrCode')}
                    </a>
                ) : t('noQrCode');
            case 'NONE': // Typically for Bank Account when no specific identifier type is explicitly set
                return account.bankAccountNumber || t('notApplicable');
            default:
                return t('notApplicable');
        }
    };

    return (
        <div className="space-y-6"> {/* Main container for consistent spacing between sections */}

            {/* General Account Details Section */}
            <section className="p-6 rounded-lg shadow-inner bg-background-light dark:bg-gray-700/50 border border-border">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {t('generalDetails')}
                </h3>
                <DetailRow label={t('receiverAccountId')} value={receiverAccount.receiverAccountId} />
                <DetailRow label={t('receiverAccountName')} value={receiverAccount.receiverAccountName} />
                {/* Display category with icon and its translated name */}
                <DetailRow label={t('receiverAccountCategory')}>
                    <div className="flex items-center gap-2">
                        {getCategoryIcon(receiverAccount.receiverAccountCategory)}
                        <span>{t(receiverAccount.receiverAccountCategory.toLowerCase())}</span>
                    </div>
                </DetailRow>
                <DetailRow label={t('receiverAccountIdentifier')} value={t(receiverAccount.receiverAccountIdentifier.toLowerCase())} />
                <DetailRow label={t('identifierValue')} value={getIdentifierValue(receiverAccount)} />

                {/* Conditional fields that might be present */}
                {receiverAccount.qrCodeImageUrl && (
                    <DetailRow label={t('qrCodeImage')}>
                        <a href={receiverAccount.qrCodeImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {t('viewImage')}
                        </a>
                    </DetailRow>
                )}
                {receiverAccount.email && <DetailRow label={t('email')} value={receiverAccount.email} />}
                {receiverAccount.phoneNumber && <DetailRow label={t('phoneNumber')} value={receiverAccount.phoneNumber} />}
            </section>

            {/* Bank Details Section - Conditional on it being a BANK_ACCOUNT */}
            {receiverAccount.receiverAccountCategory === 'BANK_ACCOUNT' && (
                <section className="p-6 rounded-lg shadow-inner bg-background-light dark:bg-gray-700/50 border border-border mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                        {t('bankDetails')}
                    </h3>
                    {/* These fields are specific to bank accounts */}
                    {receiverAccount.bankAccountNumber && <DetailRow label={t('bankAccountNumber')} value={receiverAccount.bankAccountNumber} />}
                    {receiverAccount.cardHolderName && <DetailRow label={t('cardHolderName')} value={receiverAccount.cardHolderName} />}
                    {receiverAccount.bankName && <DetailRow label={t('bankName')} value={receiverAccount.bankName} />}

                    {/* Display actual bank logo if `bank` object is present and has a logo URL */}
                    {receiverAccount.bank?.bankLogoUrl && (
                        <DetailRow label={t('bankLogo')}>
                            <Image
                                src={receiverAccount.bank.bankLogoUrl}
                                alt={receiverAccount.bank?.bankName || 'Bank Logo'}
                                width={40} // Equivalent to w-10 (40px)
                                height={40} // Equivalent to h-10 (40px)
                                className="rounded-full object-contain border border-gray-200 dark:border-gray-600 p-1"
                            />
                        </DetailRow>
                    )}
                    {/* Display bank's country details if `country` object is present within `bank` */}
                    {receiverAccount.bank?.country?.countryName && (
                        <DetailRow label={t('bankCountry')}>
                            <span className="flex items-center gap-2">
                                {receiverAccount.bank.country.countryName}
                                {receiverAccount.bank.country.countryFlagUrl && (
                                    <CountryFlag flagUrl={receiverAccount.bank.country.countryFlagUrl} alt={receiverAccount.bank.country.countryName} style={{ width: '24px', height: '18px' }} />
                                )}
                            </span>
                        </DetailRow>
                    )}
                </section>
            )}

            {/* Timestamps and Client ID Section */}
            <section className="p-6 rounded-lg shadow-inner bg-background-light dark:bg-gray-700/50 border border-border mt-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {t('additionalInfo')}
                </h3>
                <DetailRow label={t('clientId')} value={receiverAccount.clientId} />
                <DetailRow label={t('creationDate')} value={new Date(receiverAccount.creationDate).toLocaleDateString(locale)} />
                <DetailRow label={t('lastUpdatedDate')} value={new Date(receiverAccount.lastUpdatedDate).toLocaleDateString(locale)} />
            </section>
        </div>
    );
};

export default ReceiverAccountDetailsForm;

// Helper component for consistent display of label-value pairs
interface DetailRowProps {
    label: string;
    value?: React.ReactNode; // Can be string, number, or JSX element
    children?: React.ReactNode; // Alternative for value, for complex content that's JSX
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, children }) => {
    const t = useTranslations('ReceiverAccountDetailsPage');
    return (
        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-border-light last:border-b-0">
            <div className="sm:w-1/3 text-muted-foreground font-medium mb-1 sm:mb-0 pr-4"> {/* Added pr-4 for spacing */}
                {label}:
            </div>
            <div className="sm:w-2/3 text-foreground break-words">
                {value !== undefined && value !== null && value !== '' ? value : (children || t('notApplicable'))} {/* Use t for N/A */}
            </div>
        </div>
    );
}
