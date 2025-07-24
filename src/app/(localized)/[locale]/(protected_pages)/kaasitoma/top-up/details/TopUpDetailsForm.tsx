// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/TopUpDetailsForm.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Form } from "@/components/ui/form";
import { ReceiverAccount } from "../../../../../../../../types/receiver-account";
import { topUpAccountBalanceAction } from "@/lib/actions/top-up-account";
import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountCategoryType,
    ReceiverAccountIdentifierEnum
} from "@/zod-schemas/receiver-account";
import { RequestTopUpRequestSchema, RequestTopUpSchemaType } from "@/zod-schemas/request-top-up-request-schema";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel";
import { Button } from "@/components/ui/button";
import { Country } from "../../../../../../../../types/country";
import {TopUpMethodEnum} from "@/enums/TopUpMethodEnum";
import {ExchangeRate} from "../../../../../../../../types/exchangeRateResult";
import {kaasitomaPaths} from "@/util/frontend-paths";


interface TopUpDetailsFormSearchParams {
    topUpMethod?: string;
}

interface TopUpDetailsFormProps {
    initialReceiverAccount: ReceiverAccount;
    initialCountry: Country;
    initialExchangeRate: ExchangeRate;
    initialSearchParams: TopUpDetailsFormSearchParams;
    // Add the new prop for sendingFeePercentage
    sendingFeePercentage: number;
}

const TopUpDetailsForm: React.FC<TopUpDetailsFormProps> = ({
                                                               initialReceiverAccount,
                                                               initialCountry,
                                                               initialExchangeRate,
                                                               initialSearchParams,
                                                               // Destructure sendingFeePercentage from props
                                                               sendingFeePercentage
                                                           }) => {
    const t = useTranslations('TopUpDetailsForm');
    const router = useRouter();
    const locale = useLocale();

    const selectedTopUpMethod: TopUpMethodEnum | undefined =
        Object.values(TopUpMethodEnum).find(
            (method) => method === initialSearchParams.topUpMethod
        ) as TopUpMethodEnum | undefined;

    const topUpKey = Object.entries(TopUpMethodEnum).find(
        ([, value]) => value === initialSearchParams.topUpMethod
    )?.[0];
    console.log("topUpKey : ", topUpKey);


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
        receiverAccountId               : initialReceiverAccount.receiverAccountId,
        amountInCNY                     : undefined,
        destinationCurrencyCode         : initialCountry.currency.currencyCode,
        amountInDestinationCurrency     : undefined,
        sendingFee                      : undefined, // Will be set by effect
        sendingFeeCurrencyCode          : initialCountry.currency.currencyCode, // Use destination currency for sending fee by default, adjust if it's always USD
        proofPicture                    : null,
        countryOfDepositId: initialCountry.countryId,
        topUpMethod: selectedTopUpMethod || null,
    };

    const form = useForm<RequestTopUpSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(RequestTopUpRequestSchema),
        defaultValues: defaultFormValues,
    });

    const watchedAmountInCNY = form.watch("amountInCNY");
    const watchedAmountInDestinationCurrency = form.watch("amountInDestinationCurrency");
    const watchedProofPicture = form.watch("proofPicture");

    const [proofPicturePreview, setProofPicturePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    // These states are only for debugging or if other logic specifically depends on them,
    // as form.setValue directly updates the form state.
    // const [calculatedAmountInDestinationCurrency, setCalculatedAmountInDestinationCurrency] = useState<number | undefined>(undefined);
    // const [calculatedAmountInCNY, setCalculatedAmountInCNY] = useState<number | undefined>(undefined);
    const [displayedSendingFee, setDisplayedSendingFee] = useState<number | undefined>(undefined); // New state for display

    // Ref to manage programmatic updates
    const isProgrammaticUpdate = useRef(false);

    // Get the actual exchange rates from props
    const cnyToDestExchangeRate = initialExchangeRate.cnyToDestExchangeRate;
    const destToCnyExchangeRate = initialExchangeRate.destToCnyExchangeRate;


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

    // Effect for CNY input changes (drives Destination Currency)
    useEffect(() => {
        // Only run if the change was NOT programmatic
        if (isProgrammaticUpdate.current) {
            isProgrammaticUpdate.current = false; // Reset flag
            return;
        }

        // If watchedAmountInCNY has a value, calculate and set Destination Currency
        if (watchedAmountInCNY !== undefined && watchedAmountInCNY !== null && cnyToDestExchangeRate !== null && cnyToDestExchangeRate !== undefined) {
            const destAmount = watchedAmountInCNY * cnyToDestExchangeRate;
            const roundedDestAmount = parseFloat(destAmount.toFixed(2));
            // setCalculatedAmountInDestinationCurrency(roundedDestAmount);

            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInDestinationCurrency", roundedDestAmount, { shouldValidate: true });
            form.clearErrors("amountInDestinationCurrency");
        } else if (watchedAmountInCNY === undefined || watchedAmountInCNY === null) {
            // If CNY is cleared, clear Destination Currency
            // setCalculatedAmountInDestinationCurrency(undefined);
            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInDestinationCurrency", undefined, { shouldValidate: true });
            form.clearErrors("amountInDestinationCurrency");
        }
    }, [watchedAmountInCNY, cnyToDestExchangeRate, form]);

    // Effect for Destination Currency input changes (drives CNY)
    useEffect(() => {
        // Only run if the change was NOT programmatic
        if (isProgrammaticUpdate.current) {
            isProgrammaticUpdate.current = false; // Reset flag
            return;
        }

        // If watchedAmountInDestinationCurrency has a value, calculate and set CNY
        if (watchedAmountInDestinationCurrency !== undefined && watchedAmountInDestinationCurrency !== null && destToCnyExchangeRate !== null && destToCnyExchangeRate !== undefined) {
            const cnyAmount = watchedAmountInDestinationCurrency * destToCnyExchangeRate;
            const roundedCnyAmount = parseFloat(cnyAmount.toFixed(2));
            // setCalculatedAmountInCNY(roundedCnyAmount);

            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInCNY", roundedCnyAmount, { shouldValidate: true });
            form.clearErrors("amountInCNY");
        } else if (watchedAmountInDestinationCurrency === undefined || watchedAmountInDestinationCurrency === null) {
            // If Destination Currency is cleared, clear CNY
            // setCalculatedAmountInCNY(undefined);
            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInCNY", undefined, { shouldValidate: true });
            form.clearErrors("amountInCNY");
        }
    }, [watchedAmountInDestinationCurrency, destToCnyExchangeRate, form]);

    // NEW EFFECT: Calculate and display sending fee
    useEffect(() => {
        // Only calculate if the country is "DR Congo"
        if (initialCountry.countryName === "DR Congo" && sendingFeePercentage !== undefined && sendingFeePercentage !== null) {
            if (watchedAmountInDestinationCurrency !== undefined && watchedAmountInDestinationCurrency !== null) {
                const fee = watchedAmountInDestinationCurrency * (sendingFeePercentage / 100);
                const roundedFee = parseFloat(fee.toFixed(2));
                setDisplayedSendingFee(roundedFee);
                // Also update the form field for submission
                form.setValue("sendingFee", roundedFee, { shouldValidate: true });
            } else {
                setDisplayedSendingFee(undefined);
                form.setValue("sendingFee", undefined);
            }
        } else {
            setDisplayedSendingFee(undefined);
            form.setValue("sendingFee", undefined); // Ensure it's cleared if not DR Congo
        }
    }, [watchedAmountInDestinationCurrency, initialCountry.countryName, sendingFeePercentage, form]);


    // Handlers for actual user input
    const handleCnyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
        // Only set the field as dirty if the user manually changed it
        form.setValue("amountInCNY", value, { shouldValidate: true, shouldDirty: true });
    };

    const handleDestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
        // Only set the field as dirty if the user manually changed it
        form.setValue("amountInDestinationCurrency", value, { shouldValidate: true, shouldDirty: true });
    };


    const onSubmit = async (data: RequestTopUpSchemaType) => {
        setLoading(true);
        console.log("DEBUG: TopUpDetailsForm - Form data before final processing:", data);

        const formData = new FormData();

        // 1. Append fixed details from props/initial values
        formData.append("receiverAccountId", initialReceiverAccount.receiverAccountId.toString());
        formData.append("countryOfDepositId", initialCountry.countryId.toString());
        formData.append("topUpMethod", topUpKey || '');
        formData.append("destinationCurrencyCode", initialCountry.currency.currencyCode);
        formData.append("sendingFeeCurrencyCode", initialCountry.currency.currencyCode); // Use destination currency for sending fee currency code

        // 2. Append amounts from form data. `form.watch` ensures we get the latest values,
        // which now will be consistent thanks to the `useEffect` logic.
        const finalAmountInCNY = form.getValues("amountInCNY");
        const finalAmountInDestinationCurrency = form.getValues("amountInDestinationCurrency");
        const sendingFeeFromForm = form.getValues("sendingFee"); // Get the calculated sending fee from form state

        // Determine which amount to use if only one was filled by the user
        let amountToUseCNY: number | undefined;
        let amountToUseDest: number | undefined;

        const cnyDirty = form.formState.dirtyFields.amountInCNY;
        const destDirty = form.formState.dirtyFields.amountInDestinationCurrency;

        if (cnyDirty && finalAmountInCNY !== undefined && finalAmountInCNY !== null) {
            amountToUseCNY = finalAmountInCNY;
            amountToUseDest = finalAmountInCNY * cnyToDestExchangeRate;
        } else if (destDirty && finalAmountInDestinationCurrency !== undefined && finalAmountInDestinationCurrency !== null) {
            amountToUseDest = finalAmountInDestinationCurrency;
            amountToUseCNY = finalAmountInDestinationCurrency * destToCnyExchangeRate;
        } else {
            console.error("Neither CNY nor Destination Currency field was directly edited by the user, and no calculated values exist.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }

        // Final check and append to FormData
        if (amountToUseCNY !== undefined && amountToUseCNY !== null) {
            console.log("amountToUseCNY : ", amountToUseCNY);
            formData.append("amountInCNY", Number(amountToUseCNY).toFixed(2));
        } else {
            console.error("Final amountInCNY is missing after determination, cannot submit.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }

        if (amountToUseDest !== undefined && amountToUseDest !== null) {
            formData.append("amountInDestinationCurrency", Number(amountToUseDest).toFixed(2));
        } else {
            console.error("Final amountInDestinationCurrency is missing after determination, cannot submit.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }

        // Append sending fee if it was calculated
        if (sendingFeeFromForm !== undefined && sendingFeeFromForm !== null) {
            formData.append("sendingFee", sendingFeeFromForm.toFixed(2));
        }
        else formData.append("sendingFee", "0");
        // Note: If sendingFee is always required for DR Congo, you might need validation.
        // For now, it will be undefined if not DR Congo or no destination amount.


        // 3. Handle the proof picture
        if (data.proofPicture instanceof File && data.proofPicture.size > 0) {
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
                isProgrammaticUpdate.current = false; // Ensure flag is reset
                setDisplayedSendingFee(undefined); // Reset displayed sending fee
                router.push(`/${locale}${kaasitomaPaths.topUpRequestsPath}`);
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

    const isDRCongo = initialCountry.countryName === "DR Congo";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Read-Only Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">{t('summaryDetails')}</h3>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        {/* Aligned details using grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left">
                            <strong className="text-gray-800 dark:text-gray-200">{t('receiverAccountName')}:</strong>
                            <span>{getReceiverAccountDisplayName(initialReceiverAccount)}</span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('receiverAccountType')}:</strong>
                            <span>{t(getCategoryTranslationKey(initialReceiverAccount.receiverAccountCategory))}</span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('countryOfDeposit')}:</strong>
                            <span>{initialCountry.countryName} ({initialCountry.currency.currencyCode})</span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('topUpMethodLabel')}:</strong>
                            <span>{topUpKey ? t(`topUpMethod.${topUpKey}`) : initialSearchParams.topUpMethod}</span>

                            {/* Exchange Rate Section - Now with new labels for clarity */}
                            <strong className="text-gray-800 dark:text-gray-200">{t('exchangeRateCnyToDestLabel')}:</strong>
                            <span>
                                {`1 ${t('currency.CNY')} = ${initialExchangeRate.cnyToDestExchangeRate} ${t(`currency.${initialCountry.currency.currencyCode}`)}`}
                            </span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('exchangeRateDestToCnyLabel')}:</strong>
                            <span>
                                {`1 ${t(`currency.${initialCountry.currency.currencyCode}`)} = ${initialExchangeRate.destToCnyExchangeRate} ${t('currency.CNY')}`}
                            </span>

                            {/* Conditional Sending Fee Display */}
                            {isDRCongo && displayedSendingFee !== undefined && displayedSendingFee !== null && (
                                <>
                                    <strong className="text-gray-800 dark:text-gray-200">{t('sendingFee')}:</strong>
                                    <span>
                                        {displayedSendingFee.toFixed(2)} {initialCountry.currency.currencyCode}
                                    </span>
                                </>
                            )}
                        </div>
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
                    onChange={handleCnyChange}
                />

                {/* Amount in Destination Currency */}
                <InputWithLabel<RequestTopUpSchemaType>
                    fieldTitle={`${t('amountIn')} ${initialCountry.currency.currencyCode}`}
                    nameInSchema="amountInDestinationCurrency"
                    control={form.control}
                    placeholder={`e.g., 500 ${t(`currency.${initialCountry.currency.currencyCode}`)}`}
                    type="number"
                    step="0.01"
                    onChange={handleDestChange}
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
                        isProgrammaticUpdate.current = false; // Ensure flag is reset
                        setDisplayedSendingFee(undefined); // Reset displayed sending fee
                    }}>
                        {t('reset')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TopUpDetailsForm;