// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/TopUpDetailsForm.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react'; // Import useRef
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
import {ExchangeRate} from "../../../../../../../types/exchangeRateResult";


interface TopUpDetailsFormSearchParams {
    topUpMethod?: string;
}

interface TopUpDetailsFormProps {
    initialReceiverAccount: ReceiverAccount;
    initialCountry: Country;
    initialExchangeRate: ExchangeRate;
    initialSearchParams: TopUpDetailsFormSearchParams;
}

const TopUpDetailsForm: React.FC<TopUpDetailsFormProps> = ({
                                                               initialReceiverAccount,
                                                               initialCountry,
                                                               initialExchangeRate,
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
        currency: initialCountry.currency.currencyCode,
        amountInCNY: undefined,
        amountInDestinationCurrency: undefined,
        proofPicture: null,
        sendingFee: undefined
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
    // These states are only for debugging or if other logic specifically depends on them,
    // as form.setValue directly updates the form state.
    const [calculatedAmountInDestinationCurrency, setCalculatedAmountInDestinationCurrency] = useState<number | undefined>(undefined);
    const [calculatedAmountInCNY, setCalculatedAmountInCNY] = useState<number | undefined>(undefined);

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
            setCalculatedAmountInDestinationCurrency(roundedDestAmount);

            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInDestinationCurrency", roundedDestAmount, { shouldValidate: true });
            form.clearErrors("amountInDestinationCurrency");
        } else if (watchedAmountInCNY === undefined || watchedAmountInCNY === null) {
            // If CNY is cleared, clear Destination Currency
            setCalculatedAmountInDestinationCurrency(undefined);
            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInDestinationCurrency", undefined, { shouldValidate: true });
            form.clearErrors("amountInDestinationCurrency");
        }
    }, [watchedAmountInCNY, cnyToDestExchangeRate, form]); // Removed lastEditedField from deps

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
            setCalculatedAmountInCNY(roundedCnyAmount);

            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInCNY", roundedCnyAmount, { shouldValidate: true });
            form.clearErrors("amountInCNY");
        } else if (watchedAmountInDestinationCurrency === undefined || watchedAmountInDestinationCurrency === null) {
            // If Destination Currency is cleared, clear CNY
            setCalculatedAmountInCNY(undefined);
            // Set flag before programmatic update
            isProgrammaticUpdate.current = true;
            form.setValue("amountInCNY", undefined, { shouldValidate: true });
            form.clearErrors("amountInCNY");
        }
    }, [watchedAmountInDestinationCurrency, destToCnyExchangeRate, form]); // Removed lastEditedField from deps

    // Handlers for actual user input
    // These now just update the form value directly and let the effects handle conversions
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
        formData.append("receiverAccountCategory", initialReceiverAccount.receiverAccountCategory);
        formData.append("accountIdentifier", getAccountIdentifierValue(initialReceiverAccount));
        formData.append("receiverAccountId", initialReceiverAccount.receiverAccountId.toString());
        formData.append("countryOfDepositId", initialCountry.countryId.toString());
        formData.append("topUpMethod", selectedTopUpMethod || '');
        formData.append("currency", initialCountry.currency.currencyCode);

        // 2. Append amounts from form data. `form.watch` ensures we get the latest values,
        // which now will be consistent thanks to the `useEffect` logic.
        const finalAmountInCNY = form.getValues("amountInCNY");
        const finalAmountInDestinationCurrency = form.getValues("amountInDestinationCurrency");

        // Determine which amount to use if only one was filled by the user
        let amountToUseCNY: number | undefined;
        let amountToUseDest: number | undefined;

        // Logic: if only one field is dirty (user input), use that as the source of truth
        // If both are dirty, prioritize the one that was last changed (though the effects handle this for display)
        // If neither are dirty (e.g., initial state, or after a reset), then enforce input
        const cnyDirty = form.formState.dirtyFields.amountInCNY;
        const destDirty = form.formState.dirtyFields.amountInDestinationCurrency;

        if (cnyDirty && finalAmountInCNY !== undefined && finalAmountInCNY !== null) {
            amountToUseCNY = finalAmountInCNY;
            amountToUseDest = finalAmountInCNY * cnyToDestExchangeRate;
        } else if (destDirty && finalAmountInDestinationCurrency !== undefined && finalAmountInDestinationCurrency !== null) {
            amountToUseDest = finalAmountInDestinationCurrency;
            amountToUseCNY = finalAmountInDestinationCurrency * destToCnyExchangeRate;
        } else {
            // Neither field was directly edited, or both are empty.
            // This case should ideally be caught by validation, but as a fallback:
            console.error("Neither CNY nor Destination Currency field was directly edited by the user, and no calculated values exist.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }

        // Final check and append to FormData
        if (amountToUseCNY !== undefined && amountToUseCNY !== null) {
            formData.append("amountInCNY", amountToUseCNY.toFixed(2));
        } else {
            console.error("Final amountInCNY is missing after determination, cannot submit.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }

        if (amountToUseDest !== undefined && amountToUseDest !== null) {
            formData.append("amountInDestinationCurrency", amountToUseDest.toFixed(2));
        } else {
            console.error("Final amountInDestinationCurrency is missing after determination, cannot submit.");
            setLoading(false);
            alert(`${t('submissionError')}: ${t('missingAmount')}`);
            return;
        }


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
                        {/* Aligned details using grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left">
                            <strong className="text-gray-800 dark:text-gray-200">{t('receiverAccountName')}:</strong>
                            <span>{getReceiverAccountDisplayName(initialReceiverAccount)}</span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('receiverAccountType')}:</strong>
                            <span>{t(getCategoryTranslationKey(initialReceiverAccount.receiverAccountCategory))}</span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('countryOfDeposit')}:</strong>
                            <span>{initialCountry.countryName} ({initialCountry.currency.currencyCode})</span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('topUpMethodLabel')}:</strong>
                            <span>{t(`topUpMethod.${selectedTopUpMethod?.toLowerCase()}`)}</span>

                            {/* Exchange Rate Section - Now with new labels for clarity */}
                            <strong className="text-gray-800 dark:text-gray-200">{t('exchangeRateCnyToDestLabel')}:</strong>
                            <span>
                                {`1 ${t('currency.CNY')} = ${initialExchangeRate.cnyToDestExchangeRate} ${t(`currency.${initialCountry.currency.currencyCode}`)}`}
                            </span>

                            <strong className="text-gray-800 dark:text-gray-200">{t('exchangeRateDestToCnyLabel')}:</strong>
                            <span>
                                {`1 ${t(`currency.${initialCountry.currency.currencyCode}`)} = ${initialExchangeRate.destToCnyExchangeRate} ${t('currency.CNY')}`}
                            </span>
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
                    }}>
                        {t('reset')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TopUpDetailsForm;