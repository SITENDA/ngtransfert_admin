// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/TopUpRequestsForm.tsx
import React from 'react';
import {ReceiverAccount} from "../../../../../../../types/receiver-account";
import {getLocale, getTranslations} from "next-intl/server"; // Ensure ReceiverAccountCategory is imported

interface TopUpRequestsFormProps { // Renamed interface for clarity
    initialReceiverAccount: ReceiverAccount;
}

const TopUpRequestsForm: React.FC<TopUpRequestsFormProps> = async ({ initialReceiverAccount }) => {
    const t = await getTranslations('TopUpRequestsForm'); // Translations for this component
    const locale = await getLocale();
    // Use state to potentially manage sorting, filtering, or pagination if added later
    const receiverAccount = await initialReceiverAccount;

    if (!receiverAccount) {
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
                    {/* No more headers based on ResponseTopUpRequest structure */}
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">

                </tbody>
            </table>
        </div>
    );
};

export default TopUpRequestsForm;
