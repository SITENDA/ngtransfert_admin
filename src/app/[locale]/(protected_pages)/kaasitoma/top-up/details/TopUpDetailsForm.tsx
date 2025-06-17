// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/TopUpDetailsForm.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Form } from "@/components/ui/form";
import { ReceiverAccount } from "../../../../../../../types/receiver-account";
import { topUpAccountBalanceAction } from "@/lib/actions/top-up-account";
import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountCategoryType,
    ReceiverAccountIdentifierEnum
} from "@/zod-schemas/receiver-account";
import { RequestTopUpSchema, RequestTopUpSchemaType } from "@/zod-schemas/request-top-up-schema";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel";
import { Button } from "@/components/ui/button";
import { Country } from "../../../../../../../types/country";
import {TopUpMethodEnum} from "@/enums/TopUpMethodEnum";


interface TopUpDetailsFormSearchParams {
    topUpMethod?: string;
}

interface TopUpDetailsFormProps {
    initialReceiverAccount: ReceiverAccount;
    initialCountry: Country;
    initialSearchParams: TopUpDetailsFormSearchParams;
}

const TopUpDetailsForm: React.FC<TopUpDetailsFormProps> = ({
                                                               initialReceiverAccount,
                                                               initialCountry,
                                                               initialSearchParams
                                                           }) => {
    const t = useTranslations('TopUpDetailsForm');
    const router = useRouter();
    const locale = useLocale();

    const selectedTopUpMethod: TopUpMethodEnum | undefined =
        Object.values(TopUpMethodEnum).find(
            (method) => method === initialSearchParams.topUpMethod
        ) as TopUpMethodEnum | undefined;


    const getCategoryTranslationKey = (category: ReceiverAccountCategoryType): string => {
        switch (category) {
            case ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT:
                return 'alipay';
            case ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT:
                return 'wechat';
            case ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT:
                return 'bank';
            default:
                return 'unknownCategory';
        }
    };

    const getAccountIdentifierValue = (account: ReceiverAccount): string => {
        switch (account.receiverAccountIdentifier) {
            case ReceiverAccountIdentifierEnum.enum.EMAIL:
                return account.email || '';
            case ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER:
                return account.phoneNumber || '';
            case ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE:
                return account.receiverAccountName || String(account.receiverAccountId) || '';
            case ReceiverAccountIdentifierEnum.enum.NONE:
                return account.bankAccountNumber || '';
            default:
                return '';
        }
    };

    const getReceiverAccountDisplayName = (account: ReceiverAccount): string => {
        return account.receiverAccountName || getAccountIdentifierValue(account) || `ID: ${account.receiverAccountId}`;
    };

    const defaultFormValues: RequestTopUpSchemaType = {
        receiverAccountCategory: initialReceiverAccount.receiverAccountCategory,
        accountIdentifier: getAccountIdentifierValue(initialReceiverAccount),
        accountId: initialReceiverAccount.receiverAccountId,
        countryOfDepositId: initialCountry.countryId,
        topUpMethod: selectedTopUpMethod || null,
        currency: 'CNY',
        amountInCNY: undefined,
        amountInDestinationCurrency: undefined,
        proofPicture: null,
    };

    const form = useForm<RequestTopUpSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(RequestTopUpSchema),
        defaultValues: defaultFormValues,
    });

    const watchedAmountInCNY = form.watch("amountInCNY");
    const watchedAmountInDestinationCurrency = form.watch("amountInDestinationCurrency");
    const watchedProofPicture = form.watch("proofPicture");

    const [proofPicturePreview, setProofPicturePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [calculatedAmountInDestinationCurrency, setCalculatedAmountInDestinationCurrency] = useState<number | undefined>(undefined);
    const [calculatedAmountInCNY, setCalculatedAmountInCNY] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (watchedProofPicture instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPicturePreview(reader.result as string);
            };
            reader.readAsDataURL(watchedProofPicture);
        } else {
            setProofPicturePreview(null);
        }
    }, [watchedProofPicture]);

    // TODO: Integrate real exchange rate from an API
    // For demonstration, these are static exchange rates.
    const getExchangeRateCNYToDest = () => {
        // Replace with actual API call or context-provided exchange rate
        // Example: if initialCountry.currency.currencyCode is "XAF"
        if (initialCountry.currency.currencyCode === "XAF") return 0.5; // 1 CNY = 0.5 XAF
        return 1.0; // Default or fallback
    };

    const getExchangeRateDestToCNY = () => {
        // Replace with actual API call or context-provided exchange rate
        // Example: if initialCountry.currency.currencyCode is "XAF"
        if (initialCountry.currency.currencyCode === "XAF") return 2.0; // 1 XAF = 2 CNY
        return 1.0; // Default or fallback
    };


    // Effect to calculate Destination Currency amount based on CNY input
    useEffect(() => {
        const exchangeRate = getExchangeRateCNYToDest();
        if (watchedAmountInCNY !== undefined && watchedAmountInCNY !== null) {
            const destAmount = watchedAmountInCNY * exchangeRate;
            setCalculatedAmountInDestinationCurrency(parseFloat(destAmount.toFixed(2))); // Round to 2 decimal places
            form.setValue("amountInDestinationCurrency", parseFloat(destAmount.toFixed(2)), { shouldValidate: true, shouldDirty: true });
            form.clearErrors("amountInDestinationCurrency"); // Clear error if calculation makes it valid
        } else if (!form.formState.dirtyFields.amountInDestinationCurrency) {
            // Only clear if destination field hasn't been directly edited
            form.setValue("amountInDestinationCurrency", undefined, { shouldValidate: true, shouldDirty: true });
        }
    }, [watchedAmountInCNY, initialCountry.currency.currencyCode, form.setValue, form.clearErrors, form.formState.dirtyFields.amountInDestinationCurrency]);


    // Effect to calculate CNY amount based on Destination Currency input
    useEffect(() => {
        const exchangeRate = getExchangeRateDestToCNY();
        if (watchedAmountInDestinationCurrency !== undefined && watchedAmountInDestinationCurrency !== null) {
            const cnyAmount = watchedAmountInDestinationCurrency * exchangeRate;
            setCalculatedAmountInCNY(parseFloat(cnyAmount.toFixed(2))); // Round to 2 decimal places
            form.setValue("amountInCNY", parseFloat(cnyAmount.toFixed(2)), { shouldValidate: true, shouldDirty: true });
            form.clearErrors("amountInCNY"); // Clear error if calculation makes it valid
        } else if (!form.formState.dirtyFields.amountInCNY) {
            // Only clear if CNY field hasn't been directly edited
            form.setValue("amountInCNY", undefined, { shouldValidate: true, shouldDirty: true });
        }
    }, [watchedAmountInDestinationCurrency, initialCountry.currency.currencyCode, form.setValue, form.clearErrors, form.formState.dirtyFields.amountInCNY]);


    const onSubmit = async (data: RequestTopUpSchemaType) => {
        setLoading(true);
        console.log("DEBUG: TopUpDetailsForm - Form data before final processing:", data);

        const formData = new FormData();

        // 1. Append fixed details from props/initial values
        formData.append("receiverAccountCategory", initialReceiverAccount.receiverAccountCategory);
        formData.append("accountIdentifier", getAccountIdentifierValue(initialReceiverAccount));
        formData.append("receiverAccountId", initialReceiverAccount.receiverAccountId.toString());
        formData.append("countryOfDepositId", initialCountry.countryId.toString());
        formData.append("topUpMethod", selectedTopUpMethod || '');
        formData.append("currency", initialCountry.currency.currencyCode);

        // 2. Append amounts from form data or calculated values
        // Prioritize actual form input if user directly typed it, otherwise use calculated values
        let finalAmountInCNY: number | undefined = data.amountInCNY;
        let finalAmountInDestinationCurrency: number | undefined = data.amountInDestinationCurrency;

        if (finalAmountInCNY === undefined || finalAmountInCNY === null) {
            finalAmountInCNY = calculatedAmountInCNY;
        }
        if (finalAmountInDestinationCurrency === undefined || finalAmountInDestinationCurrency === null) {
            finalAmountInDestinationCurrency = calculatedAmountInDestinationCurrency;
        }

        if (finalAmountInCNY !== undefined && finalAmountInCNY !== null) {
            formData.append("amountInCNY", finalAmountInCNY.toString());
        } else {
            console.error("Final amountInCNY is missing.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }

        if (finalAmountInDestinationCurrency !== undefined && finalAmountInDestinationCurrency !== null) {
            formData.append("amountInDestinationCurrency", finalAmountInDestinationCurrency.toString());
        } else {
            console.error("Final amountInDestinationCurrency is missing.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }


        // 3. Handle the proof picture
        if (data.proofPicture instanceof File) {
            formData.append("proofPicture", data.proofPicture);
        } else {
            setLoading(false);
            alert(`${t('submissionError')}: ${t('proofPictureRequired')}`);
            return;
        }

        console.log("DEBUG: TopUpDetailsForm - FormData prepared for action:", Object.fromEntries(formData.entries()));

        try {
            const result = await topUpAccountBalanceAction(formData);
            console.log("DEBUG: TopUpDetailsForm - Server action result:", result);

            if (result.success) {
                alert(t('topUpSuccessMessage', { message: result.message }));
                form.reset(defaultFormValues);
                setProofPicturePreview(null);
                router.push(`/${locale}/kaasitoma/top-up-requests`);
            } else {
                alert(`${t('submissionError')}: ${result.message}`);
                console.error('ERROR: Top-up request submission failed:', result.message);
            }
        } catch (error) {
            console.error("CRITICAL ERROR: TopUpDetailsForm - Exception during server action call:", error);
            alert(`${t('submissionError')}: An unexpected error occurred during submission.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Read-Only Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">{t('summaryDetails')}</h3>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        <p><strong>{t('receiverAccountName')}:</strong> {getReceiverAccountDisplayName(initialReceiverAccount)}</p>
                        <p><strong>{t('receiverAccountType')}:</strong> {t(getCategoryTranslationKey(initialReceiverAccount.receiverAccountCategory))}</p>
                        <p><strong>{t('countryOfDeposit')}:</strong> {initialCountry.countryName} ({initialCountry.currency.currencyCode})</p>
                        <p><strong>{t('topUpMethod')}:</strong> {t(`topUpMethod.${selectedTopUpMethod?.toLowerCase()}`)}</p>
                    </div>
                </div>

                {/* Amount in CNY */}
                <InputWithLabel<RequestTopUpSchemaType>
                    fieldTitle={`${t('amountIn')} CNY`}
                    nameInSchema="amountInCNY"
                    control={form.control}
                    placeholder={`e.g., 1000 ${t('currency.CNY')}`}
                    type="number"
                    step="0.01"
                />

                {/* Amount in Destination Currency */}
                <InputWithLabel<RequestTopUpSchemaType>
                    fieldTitle={`${t('amountIn')} ${initialCountry.currency.currencyCode}`}
                    nameInSchema="amountInDestinationCurrency"
                    control={form.control}
                    placeholder={`e.g., 500 ${t(`currency.${initialCountry.currency.currencyCode}`)}`}
                    type="number"
                    step="0.01"
                />

                {/* Proof Picture Upload */}
                <FileInputWithLabel<RequestTopUpSchemaType>
                    fieldTitle={t('proofPicture')}
                    nameInSchema="proofPicture"
                    control={form.control}
                    imagePreview={proofPicturePreview}
                    accept=".jpg,.jpeg,.png,.webp"
                />

                <div className="flex gap-2 justify-end">
                    <Button type="submit" className="w-1/2" disabled={loading}>
                        {loading ? t('submittingTopUp') : t('submitTopUp')}
                    </Button>
                    <Button type="button" variant="outline" className="w-1/2" disabled={loading} onClick={() => {
                        form.reset(defaultFormValues);
                        setProofPicturePreview(null);
                    }}>
                        {t('reset')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TopUpDetailsForm;