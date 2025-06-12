// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/ReceiverAccountsForm.tsx
"use client"; // <--- This is a Client Component

import React from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {ReceiverAccount} from "../../../../../../types/receiver-account";

interface ReceiverAccountsFormProps {
    initialReceiverAccounts: ReceiverAccount[];
}

const ReceiverAccountsForm: React.FC<ReceiverAccountsFormProps> = ({ initialReceiverAccounts }) => {
    const t = useTranslations('ReceiverAccountsForm'); // Translations for this component
    const locale = useLocale();
    // Use state to potentially manage sorting, filtering, or pagination if added later
    const [receiverAccounts, setReceiverAccounts] = React.useState(initialReceiverAccounts);

    React.useEffect(() => {
        // Update state if initialReceiverAccounts prop changes (e.g., from revalidation)
        setReceiverAccounts(initialReceiverAccounts);
    }, [initialReceiverAccounts]);


    if (receiverAccounts.length === 0) {
        return (
            <div className="text-center text-lg text-muted-foreground p-8">
                {t('noAccountsFound')} {/* "No receiver accounts found." */}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountName')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountCategory')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('identifierType')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('identifierValue')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('bankName')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('country')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('cardHolderName')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('creationDate')}
                    </th>
                    {/* Add more headers as needed for other fields */}
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                {receiverAccounts.map((account) => (
                    <tr key={account.receiverAccountId} className="hover:bg-accent/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {account.receiverAccountName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {t(account.receiverAccountCategory.toLowerCase())} {/* Translate category */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {t(account.receiverAccountIdentifier.toLowerCase())} {/* Translate identifier type */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {/* Display based on identifier type */}
                            {account.receiverAccountIdentifier === 'EMAIL' ? account.email :
                                account.receiverAccountIdentifier === 'PHONE_NUMBER' ? account.phoneNumber :
                                    account.receiverAccountIdentifier === 'QR_CODE_IMAGE' ? (account.qrCodeImageUrl ? t('qrCodeLink') : t('noQrCode')) :
                                        account.receiverAccountIdentifier === 'NONE' ? account.bankAccountNumber :
                                            t('notApplicable')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {account.bankName || account.bank?.bankName || t('notApplicable')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {account.country?.countryName || t('notApplicable')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {account.cardHolderName || t('notApplicable')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(account.creationDate).toLocaleDateString(locale)} {/* Format date */}
                        </td>
                        {/* Add more cells for other fields */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReceiverAccountsForm;
