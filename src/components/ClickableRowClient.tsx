"use client"

import React, { JSX } from 'react';
import EmailDisplay from "@/components/EmailDisplay";
import PhoneNumberDisplay from "@/components/PhoneNumberDisplay";
import ImageDisplay from "@/components/ImageDisplay";
import {ReceiverAccount} from "../../types/receiver-account";
import {useRouter} from "@/i18n/navigation";
import {useLocale, useTranslations} from "next-intl";

function ClickableRowClient({account, href, categoryIcon}: { account: ReceiverAccount, href: string, categoryIcon: JSX.Element }) {

    const router = useRouter();
    const t = useTranslations("ReceiverAccountsTable");
    const locale = useLocale();

    return (
        <tr
            key={account.receiverAccountId}
            onClick={() => router.push(href)}
            className="cursor-pointer hover:bg-accent/50"
            role="link"
            tabIndex={0}
        >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                {account.receiverAccountName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {categoryIcon}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {t(account.receiverAccountIdentifier.toLowerCase())}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {account.receiverAccountIdentifier === "EMAIL" && account.email ? (
                    <EmailDisplay email={account.email} />
                ) : account.receiverAccountIdentifier === "PHONE_NUMBER" &&
                account.phoneNumber ? (
                    <PhoneNumberDisplay phoneNumber={account.phoneNumber} />
                ) : account.receiverAccountIdentifier === "QR_CODE_IMAGE" &&
                account.qrCodeUrl ? (
                    <ImageDisplay
                        imageUrl={account.qrCodeUrl}
                        title="Wechat QR Code"
                    />
                ) : account.receiverAccountIdentifier === "NONE" ? (
                    account.bankAccountNumber
                ) : (
                    t("notApplicable")
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {account.bank?.bankName || t("notApplicable")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {account.bank?.country?.countryName || t("notApplicable")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {account.cardHolderName || t("notApplicable")}
            </td>
            {account.creationDate && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(account.creationDate).toLocaleDateString(locale)}
                </td>
            )}
        </tr>
    );
}

export default ClickableRowClient;