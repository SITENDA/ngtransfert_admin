// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/TopUpRequestsForm.tsx
"use client"; // <--- This is a Client Component

import React from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {TopUpRequest} from "../../../../../../types/topup-request"; // Ensure ReceiverAccountCategory is imported

interface TopUpRequestsFormProps { // Renamed interface for clarity
    initialTopUpRequests: TopUpRequest[];
}

const TopUpRequestsForm: React.FC<TopUpRequestsFormProps> = ({ initialTopUpRequests }) => {
    const t = useTranslations('TopUpRequestsForm'); // Translations for this component
    const locale = useLocale();
    // Use state to potentially manage sorting, filtering, or pagination if added later
    const [topUpRequests, setTopUpRequests] = React.useState(initialTopUpRequests);

    React.useEffect(() => {
        // Update state if initialTopUpRequests prop changes (e.g., from revalidation)
        setTopUpRequests(initialTopUpRequests);
    }, [initialTopUpRequests]);


    if (topUpRequests.length === 0) {
        return (
            <div className="text-center text-lg text-muted-foreground p-8">
                {t('noTopUpRequestsFound')} {/* New translation key */}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('topUpId')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountCategory')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountIdentifier')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountId')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('amountInCNY')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('proofPicture')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('currency')}
                    </th>
                    {/* No more headers based on TopUpRequest structure */}
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                {topUpRequests.map((request) => ( // Changed variable name from 'account' to 'request' for clarity
                    <tr key={request.topUpId} className="hover:bg-accent/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {request.topUpId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {/* Ensure translation key matches enum values, e.g., 'alipay_account' */}
                            {t((request.receiverAccountCategory as string).toLowerCase())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {request.accountIdentifier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.accountId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {request.amountInCNY.toFixed(2)} {/* Format amount to 2 decimal places */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.proofPictureUrl ? (
                                <a href={request.proofPictureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {t('viewProof')}
                                </a>
                            ) : (
                                t('noProof')
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.currency.currencyCode} ({request.currency.currencySymbol})
                        </td>
                        {/* No more cells based on TopUpRequest structure */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopUpRequestsForm;
