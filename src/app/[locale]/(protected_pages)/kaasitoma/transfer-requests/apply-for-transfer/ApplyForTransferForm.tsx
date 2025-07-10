"use client";

import React, { useEffect, useState } from 'react';
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Country } from "../../../../../../../types/country";
import { TransferRequestSchema, TransferRequestSchemaType } from "@/zod-schemas/transfer-request";
import { useOrderedCountries } from "@/hooks/useOrderedCountries";

import { createTransferRequestAction } from "@/lib/actions/transfer-request";
import {ReceiverAccount} from "../../../../../../../types/receiver-account";

interface ApplyForTransferFormProps {
    initialCountries: Country[];
    receiverAccount: ReceiverAccount;
    clientId: number;
}

const ApplyForTransferForm: React.FC<ApplyForTransferFormProps> = ({ initialCountries, clientId, receiverAccount }) => {
    const t = useTranslations('ApplyForTransferForm');
    const router = useRouter();
    const locale = useLocale();

    const defaultEmptyValues: TransferRequestSchemaType = {
        amount: undefined,
        currencyCode: undefined,
        rate: undefined,
        remark: undefined,
        receiverAccountId: receiverAccount.receiverAccountId, // Prefilled from props
        clientId: clientId, // Prefilled from props
        countryOfDepositId: undefined,
    };

    const form = useForm<TransferRequestSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(TransferRequestSchema),
        defaultValues: defaultEmptyValues,
    });

    const watchedCountryOfDepositId = form.watch("countryOfDepositId");

    const [selectedCountryObj, setSelectedCountryObj] = useState<Country | null>(null);
    const [loading, setLoading] = useState(false);

    const countryOptions = useOrderedCountries(initialCountries);

    useEffect(() => {
        if (watchedCountryOfDepositId !== undefined && watchedCountryOfDepositId !== null) {
            const country = initialCountries.find(c => c.countryId === Number(watchedCountryOfDepositId));
            setSelectedCountryObj(country || null);

            if (country && country.currency) {
                if (form.getValues("currencyCode") !== country.currency.currencyCode) {
                    form.setValue("currencyCode", country.currency.currencyCode, { shouldDirty: true, shouldValidate: true });
                }
            } else {
                form.setValue("currencyCode", undefined, { shouldDirty: true, shouldValidate: true });
            }
        } else {
            setSelectedCountryObj(null);
            form.setValue("currencyCode", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("amount", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("rate", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("remark", undefined, { shouldDirty: true, shouldValidate: true });
            // Keep receiverAccountId and clientId pre-filled if they come from props
            form.setValue("receiverAccountId", receiverAccount.receiverAccountId, { shouldDirty: false, shouldValidate: true });
            form.setValue("clientId", clientId, { shouldDirty: false, shouldValidate: true });
        }
    }, [watchedCountryOfDepositId, initialCountries, form, receiverAccount.receiverAccountId, clientId]); // Added clientId to dependency array

    const onSubmit = async (data: TransferRequestSchemaType) => {
        console.log("DEBUG: 'onSubmit' function STARTED.");

        if (selectedCountryObj === null) {
            console.error("DEBUG: 'No country has been selected.' Preventing submission.");
            setLoading(false);
            return;
        }

        // Validate the form before proceeding. Check if form is valid based on Zod schema.
        // if (!form.formState.isValid) {
        //     console.error("DEBUG: Form validation failed. Preventing submission. Errors:", form.formState.errors);
        //     setLoading(false);
        //     return;
        // }

        setLoading(true);
        console.log("DEBUG: Applying for transfer with data (before final additions):", data);

        // Populate fields that are not part of user input in the form directly,
        // ensuring they are part of the `data` object that will be stringified.
        // These are already set as defaultValues, but explicit assignment here ensures it.
        data.clientId = clientId;
        data.receiverAccountId = receiverAccount.receiverAccountId;

        // Ensure currencyCode is definitively in the data object from the selected country.
        // It's set by `useEffect` and `form.setValue`, but this ensures it's there
        // for the final payload, especially if validation somehow allows it to be missing.
        if (selectedCountryObj.currency && selectedCountryObj.currency.currencyCode) {
            data.currencyCode = selectedCountryObj.currency.currencyCode;
        } else {
            console.error("ERROR: Selected country has no valid currency code. Cannot proceed.");
            alert(`${t('submissionError')}: Selected country currency is missing.`);
            setLoading(false);
            return;
        }

        console.log("DEBUG: Data prepared for transfer (final payload to action):", data);
        // Removed: console.log("Form data : ", formData, "\n\n\n"); // FormData is no longer used

        try {
            // Pass the `data` object directly. The `createTransferRequestAction` will handle JSON.stringify.
            const result = await createTransferRequestAction(data);
            console.log("DEBUG: Server action result:", result);

            if (result.success) {
                alert(t('transferSuccessMessage', { message: result.message }));
                form.reset(defaultEmptyValues);
                const redirectPath = `/${locale}/kaasitoma/transfer-requests`;
                router.push(redirectPath);
            } else {
                alert(`${t('submissionError')}: ${result.message}`);
                console.error('ERROR: Transfer request submission failed (Server Action reported error):', result.message);
            }
        } catch (error) {
            console.error("CRITICAL ERROR: Exception caught when calling 'createTransferRequestAction':", error);
            alert(`${t('submissionError')}: An unexpected error occurred while calling the server action.`);
        } finally {
            setLoading(false);
            console.log("DEBUG: 'onSubmit' function FINISHED.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md bg-white dark:bg-gray-700">
                <SelectWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('countryOfDeposit')}
                    nameInSchema="countryOfDepositId"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectCountryPlaceholder')}
                />

                {(watchedCountryOfDepositId !== undefined && watchedCountryOfDepositId !== null) && (
                    <div className="mb-4 w-full max-w-xs">
                        <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-200">
                            {t('sourceCurrency')}
                        </label>
                        <p className="mt-1 block w-full px-3 py-2 text-base rounded-md bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-500">
                            {`${selectedCountryObj?.currency?.currencyName || ''} (${selectedCountryObj?.currency?.currencyCode || ''})` || t('sourceCurrencyPlaceholder')}
                        </p>
                    </div>
                )}

                {(watchedCountryOfDepositId !== undefined) && (
                    <>
                        <InputWithLabel<TransferRequestSchemaType>
                            fieldTitle={t('amount')}
                            nameInSchema="amount"
                            control={form.control}
                            placeholder={t('amountPlaceholder')}
                            type="number"
                            step="0.01"
                        />

                        <InputWithLabel<TransferRequestSchemaType>
                            fieldTitle={t('rate')}
                            nameInSchema="rate"
                            control={form.control}
                            placeholder={t('ratePlaceholder')}
                            type="number"
                            step="0.0001"
                        />

                        <InputWithLabel<TransferRequestSchemaType>
                            fieldTitle={t('remark')}
                            nameInSchema="remark"
                            control={form.control}
                            placeholder={t('remarkPlaceholder')}
                            type="text"
                        />
                    </>
                )}

                <div className="flex gap-2">
                    <Button type="submit" className="w-1/2">
                        {loading ? t('submittingTransfer') : t('applyForTransferButton')}
                    </Button>
                    <Button type="button" className="w-1/2" variant="destructive" title={t('reset')} disabled={loading && selectedCountryObj != null} onClick={() => form.reset(defaultEmptyValues)}>
                        {t('reset')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ApplyForTransferForm;