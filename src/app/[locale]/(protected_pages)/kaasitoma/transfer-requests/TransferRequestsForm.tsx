// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/TransferRequestsForm.tsx
"use client"; // <--- This is a Client Component

import React from 'react';
import {useTranslations} from 'next-intl';
import {TransferRequest} from "../../../../../../types/transfer-requests";

interface TransferRequestsFormProps {
    initialTransferRequests: TransferRequest[];
}

const TransferRequestsForm: React.FC<TransferRequestsFormProps> = ({ initialTransferRequests }) => {
    const t = useTranslations('TransferRequestsForm'); // Translations for this component
    // Use state to potentially manage sorting, filtering, or pagination if added later
    const [transferRequests, setTransferRequests] = React.useState(initialTransferRequests);

    React.useEffect(() => {
        // Update state if initialTransferRequests prop changes (e.g., from revalidation)
        setTransferRequests(initialTransferRequests);
    }, [initialTransferRequests]);


    if (transferRequests.length === 0) {
        return (
            <div className="text-center text-lg text-muted-foreground p-8">
                {t('noTransferRequestsFound')} {/* Adjusted translation key */}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('amount')} {/* Header for amount */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('currencyId')} {/* Header for currencyId */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('rate')} {/* Header for rate */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('remark')} {/* Header for remark */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('receiverAccountCategory')} {/* Header for receiverAccountCategory */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('receiverAccountId')} {/* Header for receiverAccountId */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('clientId')} {/* Header for clientId */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('countryOfDepositId')} {/* Header for countryOfDepositId */}
                    </th>
                    {/* Add more headers if your TransferRequest has additional fields not listed above */}
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                {transferRequests.map((request) => (
                    <tr key={request.receiverAccountId + "-" + request.clientId} className="hover:bg-accent/50"> {/* Using a combined key for uniqueness */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {request.amount.toFixed(2)} {/* Format amount */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.currencyId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {request.rate.toFixed(4)} {/* Format rate, adjust decimals as needed */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.remark || t('noRemark')} {/* Display remark, or a placeholder if null */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {/* Translate category, ensure your translation keys match the enum values (e.g., 'alipay_account') */}
                            {t((request.receiverAccountCategory as string).toLowerCase())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {request.receiverAccountId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.clientId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.countryOfDepositId}
                        </td>
                        {/* Add more cells if your TransferRequest has additional fields */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransferRequestsForm;
