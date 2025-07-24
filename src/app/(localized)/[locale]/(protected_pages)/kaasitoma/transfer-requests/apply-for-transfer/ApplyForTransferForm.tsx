// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/ApplyForTransferForm.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; // Assuming this is a context provider for react-hook-form

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Country } from "../../../../../../../../types/country";
import { TransferRequestSchema, TransferRequestSchemaType } from "@/zod-schemas/transfer-request";
import { useOrderedCountries } from "@/hooks/useOrderedCountries";
// Removed: import { useOrderedCurrencies } from "@/hooks/useOrderedCurrencies"; // No longer needed for selection

import { createTransferRequestAction } from "@/lib/actions/transfer-request";
import {ReceiverAccount} from "../../../../../../../../types/receiver-account"; // Server Action

interface ApplyForTransferFormProps {
    initialCountries: Country[];
    receiverAccount: ReceiverAccount;
    clientId: number; // Client ID passed from the Server Component
}

const ApplyForTransferForm: React.FC<ApplyForTransferFormProps> = ({ initialCountries, clientId, receiverAccount }) => {
    const t = useTranslations('ApplyForTransferForm');
    const router = useRouter();
    const locale = useLocale();

    // Default form values: Use 'undefined' for fields that are optional in Zod schema
    const defaultEmptyValues: TransferRequestSchemaType = {
        amount: undefined,
        currencyId: undefined, // This will now be set by effect, not user selection
        rate: undefined,
        remark: undefined,
        receiverAccountCategory: undefined,
        receiverAccountId: undefined,
        clientId: clientId, // Pre-fill clientId from props
        countryOfDepositId: undefined,
    };

    const form = useForm<TransferRequestSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(TransferRequestSchema),
        defaultValues: defaultEmptyValues,
        shouldUnregister: true
    });

    const watchedCountryOfDepositId = form.watch("countryOfDepositId");

    const [selectedCountryObj, setSelectedCountryObj] = useState<Country | null>(null);
    const [loading, setLoading] = useState(false);

    // Filter and order countries for the SelectWithLabel
    const countryOptions = useOrderedCountries(initialCountries);
    // Removed: const currencyOptions = useOrderedCurrencies(initialCurrencies, selectedCountryObj); // No longer needed for selection

    // Effect to update selectedCountryObj and automatically set currencyId
    useEffect(() => {
        if (watchedCountryOfDepositId !== undefined && watchedCountryOfDepositId !== null) {
            const country = initialCountries.find(c => c.countryId === Number(watchedCountryOfDepositId));
            setSelectedCountryObj(country || null);

            // Automatically set currencyId from the selected country's default currency
            if (country && country.currency) {
                if (form.getValues("currencyId") !== country.currency.currencyId) {
                    form.setValue("currencyId", country.currency.currencyId, { shouldDirty: true, shouldValidate: true });
                }
            } else {
                // If country has no currency or is null, clear currencyId
                form.setValue("currencyId", undefined, { shouldDirty: true, shouldValidate: true });
            }
        } else {
            setSelectedCountryObj(null);
            // Reset currency and all subsequent fields if country is unselected/reset
            form.setValue("currencyId", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("amount", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("rate", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("remark", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("receiverAccountCategory", undefined, { shouldDirty: true, shouldValidate: true });
            form.setValue("receiverAccountId", undefined, { shouldDirty: true, shouldValidate: true });
        }
    }, [watchedCountryOfDepositId, initialCountries, form]);

    const onSubmit = async (data: TransferRequestSchemaType) => {
        console.log("DEBUG: 'onSubmit' function STARTED.");
        console.log("DEBUG: Form 'isValid' state BEFORE submission logic:", form.formState.isValid);
        console.log("DEBUG: Form 'errors' state BEFORE submission logic (if any):", form.formState.errors);

        if (!form.formState.isValid) {
            console.error("DEBUG: Form validation failed. Preventing submission. Check form.formState.errors for details.");
            setLoading(false);
            return;
        }

        setLoading(true);
        console.log("DEBUG: Applying for transfer with data (before final additions):", data);

        data.clientId = clientId;
        data.receiverAccountCategory = receiverAccount.receiverAccountCategory;
        data.receiverAccountId = receiverAccount.receiverAccountId;

        console.log("DEBUG: Data prepared for transfer (final payload to action):", data);

        try {
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
                {/* Country of Deposit Selector - Always Visible */}
                <SelectWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('countryOfDeposit')}
                    nameInSchema="countryOfDepositId"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectCountryPlaceholder')}
                />

                {/* Source Currency Display (read-only) - Conditional on Country Selection */}
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

                {/* Amount, Rate, Remark Inputs - Conditional on Currency being set (which is automatic) */}
                {/* Condition updated to check if currencyId is present, which implies country is selected and currency is set */}
                {(watchedCountryOfDepositId !== undefined && watchedCountryOfDepositId !== null) && (
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
                    <Button type="submit" className="w-3/4" variant="default" title={t('applyForTransferButton')} disabled={loading}>
                        {loading ? t('submittingTransfer') : t('applyForTransferButton')}
                    </Button>
                    <Button type="button" className="w-1/2" variant="destructive" title={t('reset')} disabled={loading} onClick={() => form.reset(defaultEmptyValues)}>
                        {t('reset')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ApplyForTransferForm;