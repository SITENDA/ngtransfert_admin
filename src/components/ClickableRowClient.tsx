"use client";

import React, { JSX } from "react";
import EmailDisplay from "@/components/EmailDisplay";
import PhoneNumberDisplay from "@/components/PhoneNumberDisplay";
import ImageDisplay from "@/components/ImageDisplay";
import { ReceiverAccount } from "../../types/receiver-account";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {ReceiverAccountCategoryEnum, ReceiverAccountIdentifierEnum} from "@/zod-schemas/receiver-account";
import BankLogo from "@/components/BankLogo";

function ClickableRowClient({
                                account,
                                href,
                                categoryIcon,
                            }: {
    account: ReceiverAccount;
    href: string;
    categoryIcon: JSX.Element;
}) {
    const router = useRouter();
    const t = useTranslations("ReceiverAccountsTable");
    const locale = useLocale();
    console.log("Account is : ", account);

    return (
        <tr
            onClick={() => router.push(href)}
            className="cursor-pointer hover:bg-accent/50"
            role="link"
            tabIndex={0}
        >
            {/* Account name (already card holder name for BANK accounts) */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                {account.receiverAccountName}
            </td>

            {/* Category */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {categoryIcon}
            </td>

            {/* Identifier type */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {account.receiverAccountCategory === ReceiverAccountCategoryEnum.Enum.BANK_ACCOUNT && account.bank ? (
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 flex items-center justify-center">
                            <BankLogo
                                logoUrl={account.bank.bankLogoUrl}
                                alt={account.bank.bankShortName}
                                className="max-h-6 max-w-6 object-contain"
                            />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                {account.bank.bankShortName}
            </span>
                    </div>
                ) : (
                    t(account.receiverAccountIdentifier.toLowerCase())
                )}
            </td>

            {/* Identifier value */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {account.receiverAccountCategory === ReceiverAccountCategoryEnum.Enum.BANK_ACCOUNT ? (
                    account.bankAccountNumber ?? t("notApplicable")
                ) : account.receiverAccountIdentifier === ReceiverAccountIdentifierEnum.Enum.EMAIL && account.email ? (
                    <EmailDisplay email={account.email} />
                ) : account.receiverAccountIdentifier === ReceiverAccountIdentifierEnum.Enum.PHONE_NUMBER &&
                account.phoneNumber ? (
                    <PhoneNumberDisplay phoneNumber={account.phoneNumber} />
                ) : account.receiverAccountIdentifier === ReceiverAccountIdentifierEnum.Enum.QR_CODE_IMAGE &&
                account.qrCodeUrl ? (
                    <ImageDisplay imageUrl={account.qrCodeUrl} title="Wechat QR Code" />
                ) : (
                    t("notApplicable")
                )}
            </td>
        </tr>
    );
}

export default ClickableRowClient;
