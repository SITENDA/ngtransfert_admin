// src/app/[locale]/(protected_pages)/kaasitoma/top-up/TopUpRequestsTable.tsx
import React from 'react';
import { getTranslations, getLocale } from "next-intl/server"; // Import getLocale
import { ResponseTopUpRequest } from "../../../../../../../types/response-top-up-request";
import { TopUpMethodEnum } from "@/enums/TopUpMethodEnum"; // Ensure TopUpMethodEnum is imported if used for display
import { Link } from "@/i18n/navigation"; // Assuming you want to link to details
import { kaasitomaPaths } from "@/util/frontend-paths"; // Import paths if linking to details

interface TopUpRequestsTableProps { // Renamed for clarity in the file
    initialTopUpRequests: ResponseTopUpRequest[];
    // initialReceiverAccount: ReceiverAccount; // This prop seems extraneous for a table of TopUpRequests
}

const TopUpRequestsTable: React.FC<TopUpRequestsTableProps> = async ({ initialTopUpRequests }) => {
    const t = await getTranslations('TopUpRequestsTable');
    const locale = await getLocale(); // Get current locale for date formatting
    const topUpRequests = await initialTopUpRequests;

    // Helper to get translated TopUpMethod (if needed, otherwise just display enum value)
    const getTopUpMethodTranslationKey = (method: TopUpMethodEnum): string => {
        return `topUpMethod.${method.toLowerCase()}`;
    };

    if (topUpRequests?.length === 0) {
        return (
            <div className="text-center text-lg text-muted-foreground p-8">
                {t('noTopUpRequestsFound')}
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
                        {t('receiverAccountId')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('amountInCNY')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('amountInDestinationCurrency')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('destinationCurrency')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('sendingFee')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('sendingFeeCurrency')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('countryOfDeposit')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('topUpMethodLabel')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('proofPicture')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('status')}
                    </th>
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                {topUpRequests.map((request) => (
                    <tr key={request.topUpId} className="hover:bg-accent/50 group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground relative">
                            {/* Example: Link to a theoretical top-up request details page */}
                            {/* Adjust the path as needed for your application's routing */}
                            <Link
                                href={`${kaasitomaPaths.topUpRequestDetailsPath}/${request.topUpId}`}
                                passHref
                                className="absolute inset-0 flex items-center p-6 text-foreground hover:underline group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            >
                                {request.topUpId}
                            </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.receiverAccountId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {request.amountInCNY.toFixed(2)} CNY
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {request.amountInDestinationCurrency.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.destinationCurrency.currencyCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {request.sendingFee.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.sendingFeeCurrency.currencyCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.countryOfDeposit.countryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {t(getTopUpMethodTranslationKey(request.topUpMethod))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {request.proofPictureUrl ? (
                                <a
                                    href={request.proofPictureUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                    // onClick={(e) => e.stopPropagation()} // Prevent row link from triggering
                                >
                                    {t('viewProof')}
                                </a>
                            ) : (
                                t('noProof')
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    request.isApproved
                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                }`}>
                                    {request.isApproved ? t('approved') : t('pending')}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopUpRequestsTable;