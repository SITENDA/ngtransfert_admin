// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/ReceiverAccountsTable.tsx
// This is a Server Component.

import React from 'react';
import {ReceiverAccount} from "../../../../../../../types/receiver-account";
import {Link} from "@/i18n/navigation"; // Keep Link for navigation

// Import FontAwesome icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWeixin, faAlipay} from '@fortawesome/free-brands-svg-icons'; // WeChat and Alipay icons
import {faUniversity} from '@fortawesome/free-solid-svg-icons';
import {getLocale, getTranslations} from "next-intl/server";
import {kaasitomaPaths} from "@/util/frontend-paths"; // Bank icon

interface ReceiverAccountsFormProps {
    initialReceiverAccounts: ReceiverAccount[];
}

const ReceiverAccountsTable: React.FC<ReceiverAccountsFormProps> = async ({initialReceiverAccounts}) => {
    const t = await getTranslations('ReceiverAccountsTable'); // Translations for this component
    const locale = await getLocale();
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
                return null;
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
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountName')}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('accountCategory')}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('identifierType')}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('identifierValue')}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('bankName')}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('country')}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('cardHolderName')}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('creationDate')}
                    </th>
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                {receiverAccounts.map((account) => (
                    <tr
                        key={account.receiverAccountId} // Key prop on the <tr>
                        className="hover:bg-accent/50 group" // Use group to allow child link to style whole row
                    >
                        {/* Wrap the content of the first cell with Link, and make it fill the cell */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground relative">
                            <Link
                                href={`${kaasitomaPaths.receiverAccountDetailsPath}${account.receiverAccountId}`}
                                passHref
                                className="absolute inset-0 flex items-center p-6 text-foreground hover:underline group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            >
                                {account.receiverAccountName}
                            </Link>
                        </td>
                        {/* Other cells remain regular td's but are visually "covered" by the first cell's link */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {getCategoryIcon(account.receiverAccountCategory)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {t(account.receiverAccountIdentifier.toLowerCase())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {account.receiverAccountIdentifier === 'EMAIL' ? account.email :
                                account.receiverAccountIdentifier === 'PHONE_NUMBER' ? account.phoneNumber :
                                    account.receiverAccountIdentifier === 'QR_CODE_IMAGE' ? (account.qrCodeUrl ? t('qrCodeLink') : t('noQrCode')) :
                                        account.receiverAccountIdentifier === 'NONE' ? account.bankAccountNumber :
                                            t('notApplicable')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {account.bank?.bankName || account.bank?.bankName || t('notApplicable')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {account.bank?.country?.countryName || t('notApplicable')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {account.cardHolderName || t('notApplicable')}
                        </td>

                        {account?.creationDate &&
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {new Date(account.creationDate).toLocaleDateString(locale)}
                            </td>
                        }

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReceiverAccountsTable;
