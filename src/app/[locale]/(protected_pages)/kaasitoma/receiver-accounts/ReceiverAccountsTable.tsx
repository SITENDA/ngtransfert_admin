// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/ReceiverAccountsTable.tsx

import React from 'react';
import {ReceiverAccount} from "../../../../../../types/receiver-account";

// Import FontAwesome icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWeixin, faAlipay} from '@fortawesome/free-brands-svg-icons'; // WeChat and Alipay icons
import {faUniversity} from '@fortawesome/free-solid-svg-icons';
import {getTranslations} from "next-intl/server";
import {kaasitomaPaths} from "@/util/frontend-paths";
import ClickableRowClient from "@/components/ClickableRowClient"; // Bank icon

interface ReceiverAccountsFormProps {
    initialReceiverAccounts: ReceiverAccount[];
    isFromTopUp: boolean;
}

const ReceiverAccountsTable: React.FC<ReceiverAccountsFormProps> = async ({initialReceiverAccounts, isFromTopUp}) => {
    const t = await getTranslations('ReceiverAccountsTable'); // Translations for this component
    // No useState/useEffect as it's a Server Component
    const receiverAccounts = initialReceiverAccounts;

    // Helper function to get the appropriate icon for a receiver account category
    const getCategoryIcon = (category: ReceiverAccount['receiverAccountCategory']) => {
        switch (category) {
            case 'ALIPAY_ACCOUNT':
                return <FontAwesomeIcon icon={faAlipay} style={{color: '#1677FF', fontSize: '1em', maxWidth: '30px'}}
                                        className="m-auto"/>;
            case 'WECHAT_ACCOUNT':
                return <FontAwesomeIcon icon={faWeixin} style={{color: '#07C160', fontSize: '1em', maxWidth: '30px'}}
                                        className="m-auto"/>;
            case 'BANK_ACCOUNT':
                return <FontAwesomeIcon icon={faUniversity}
                                        style={{color: '#FF4500', fontSize: '1em', maxWidth: '30px'}}
                                        className="m-auto"/>;
            default:
                return <FontAwesomeIcon icon={faUniversity}
                                        style={{color: '#FF4500', fontSize: '1em', maxWidth: '30px'}}
                                        className="m-auto"/>;
        }
    };

    if (receiverAccounts?.length === 0) {
        return (
            <div className="text-center text-lg text-muted-foreground p-8">
                {t('noAccountsFound')}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                <tr>
                    <th className="px-6 py-3 text-left">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {t('accountName')}
                            </span>
                                    <span className="text-[11px] text-muted-foreground normal-case">
                                ({t('cardHolderNameHint')})
                            </span>
                        </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountCategory')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="flex flex-col">
                            <span>{t('identifierType')}</span>
                            <span className="text-[11px] text-muted-foreground normal-case">
                                ({t('bankName')})
                            </span>
                        </div>
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('identifierValue')}
                    </th>
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                {receiverAccounts.map((account) => (
                    <ClickableRowClient
                        key={account.receiverAccountId}
                        account={account}
                        href={
                            isFromTopUp
                                ? `${kaasitomaPaths.topUpCountryAndMethodPath}${account.receiverAccountId}`
                                : `${kaasitomaPaths.receiverAccountDetailsPath}${account.receiverAccountId}`
                        }
                        categoryIcon={getCategoryIcon(account.receiverAccountCategory)}/>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};

export default ReceiverAccountsTable;
