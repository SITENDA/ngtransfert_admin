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

import { Country } from "../../../../../../../types/country";
import { Currency } from "../../../../../../../types/currency";
import { TransferRequestSchema, TransferRequestSchemaType } from "@/zod-schemas/transfer-request";
import { useOrderedCountries } from "@/hooks/useOrderedCountries";
import { useOrderedCurrencies } from "@/hooks/useOrderedCurrencies";

import { createTransferRequestAction } from "@/lib/actions/transfer-request";
import {ReceiverAccount} from "../../../../../../../types/receiver-account"; // Server Action

interface ApplyForTransferFormProps {
    initialCountries: Country[];
    initialCurrencies: Currency[];
    receiverAccount: ReceiverAccount; // Ensure this prop is received
    clientId: number; // Client ID passed from the Server Component
}

const ApplyForTransferForm: React.FC<ApplyForTransferFormProps> = ({ initialCountries, initialCurrencies, clientId, receiverAccount }) => { // Destructure receiverAccount
    const t = useTranslations('ApplyForTransferForm');
    const router = useRouter();
    const locale = useLocale();

    // Default form values: Use 'undefined' for fields that are optional in Zod schema
    // and should not be validated until they are visible/interacted with.
    const defaultEmptyValues: TransferRequestSchemaType = {
        amount: undefined,
        currencyId: undefined,
        rate: undefined,
        remark: undefined,
        receiverAccountCategory: undefined, // These will be populated from receiverAccount prop in onSubmit
        receiverAccountId: undefined,       // These will be populated from receiverAccount prop in onSubmit
        clientId: clientId, // Pre-fill clientId from props
        countryOfDepositId: undefined,
    };

    const form = useForm<TransferRequestSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(TransferRequestSchema),
        defaultValues: defaultEmptyValues,
        shouldUnregister: true // Keep this as per your provided code
    });

    const watchedCountryOfDepositId = form.watch("countryOfDepositId");
    const watchedCurrencyId = form.watch("currencyId"); // Watch currency selection for conditional rendering

    // State for the selected country object (needed for prioritizing its currency)
    const [selectedCountryObj, setSelectedCountryObj] = useState<Country | null>(null);
    const [loading, setLoading] = useState(false);

    // Filter and order countries for the SelectWithLabel
    const countryOptions = useOrderedCountries(initialCountries);
    // Filter and order currencies, prioritizing the selected country's currency
    const currencyOptions = useOrderedCurrencies(initialCurrencies, selectedCountryObj);

    // Effect to update selectedCountryObj when watchedCountryOfDepositId changes
    useEffect(() => {
        console.log('DEBUG (Effect 1): watchedCountryOfDepositId changed to:', watchedCountryOfDepositId);
        if (watchedCountryOfDepositId !== undefined && watchedCountryOfDepositId !== null) { // Explicitly check for non-undefined/null
            const country = initialCountries.find(c => c.countryId === watchedCountryOfDepositId);
            setSelectedCountryObj(country || null);
            // Optionally, set the currencyId if a country is selected and has a currency
            if (country && country.currency) {
                if (form.getValues("currencyId") !== country.currency.currencyId) {
                    form.setValue("currencyId", country.currency.currencyId, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
                    console.log('DEBUG (Effect 1): Setting currencyId to:', country.currency.currencyId);
                }
            } else {
                form.setValue("currencyId", undefined, { shouldDirty: true, shouldValidate: true }); // Clear currency and validate
                console.log('DEBUG (Effect 1): Clearing currencyId.');
            }
        } else {
            setSelectedCountryObj(null);
            // Reset currency and all subsequent fields if country is unselected/reset
            form.setValue("currencyId", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("amount", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("rate", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("remark", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("receiverAccountCategory", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("receiverAccountId", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            console.log('DEBUG (Effect 1): Clearing all dependent fields due to country unselection/initial undefined.');
        }
    }, [watchedCountryOfDepositId, initialCountries, form]);

    // Effect to reset dependent fields when currency is unselected
    useEffect(() => {
        console.log('DEBUG (Effect 2): watchedCurrencyId changed to:', watchedCurrencyId);
        if (watchedCurrencyId === undefined && watchedCountryOfDepositId !== undefined && watchedCountryOfDepositId !== null) {
            form.setValue("amount", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("rate", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("remark", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("receiverAccountCategory", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            form.setValue("receiverAccountId", undefined, { shouldDirty: true, shouldValidate: true }); // Add shouldValidate
            console.log('DEBUG (Effect 2): Clearing dependent fields due to currency unselection.');
        }
    }, [watchedCurrencyId, watchedCountryOfDepositId, form]);

    const onSubmit = async (data: TransferRequestSchemaType) => {
        console.log("DEBUG: 'onSubmit' function STARTED.");

        // IMPORTANT: Log current form state and errors *before* setting loading or making API call
        console.log("DEBUG: Form 'isValid' state BEFORE submission logic:", form.formState.isValid);
        console.log("DEBUG: Form 'errors' state BEFORE submission logic (if any):", form.formState.errors);

        // If form.formState.isValid is false here, it means Zod validation failed.
        // The handleSubmit wrapper should prevent this 'onSubmit' from running if validation fails.
        // If this log appears and isValid is false, it's an indication to check validation issues.
        if (!form.formState.isValid) {
            console.error("DEBUG: Form validation failed. Preventing submission. Check form.formState.errors for details.");
            setLoading(false); // Ensure loading state is reset
            return; // Explicitly stop if validation fails
        }


        setLoading(true);
        console.log("DEBUG: Applying for transfer with data (before final additions):", data);

        // ClientId is pre-filled from defaultValues, and will be set securely by the backend
        data.clientId = clientId;
        // IMPORTANT FIX: Populate receiverAccountCategory and receiverAccountId from the prop
        data.receiverAccountCategory = receiverAccount.receiverAccountCategory;
        data.receiverAccountId = receiverAccount.receiverAccountId;

        console.log("DEBUG: Data prepared for transfer (final payload to action):", data);

        try {
            // Call the server action to create the transfer request
            const result = await createTransferRequestAction(data);
            console.log("DEBUG: Server action result:", result);

            if (result.success) {
                alert(t('transferSuccessMessage', { message: result.message }));
                form.reset(defaultEmptyValues); // Reset form to initial empty state
                const redirectPath = `/${locale}/kaasitoma/transfer-requests`; // Redirect to the list of transfer requests
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
            {/* The onSubmit prop belongs ONLY on the <form> element for react-hook-form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md bg-white dark:bg-gray-700">
                {/* Country of Deposit Selector - Always Visible */}
                <SelectWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('countryOfDeposit')}
                    nameInSchema="countryOfDepositId"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectCountryPlaceholder')}
                />

                {/* Currency Selector - Conditional on Country Selection */}
                {/* Check for non-undefined/null on watchedCountryOfDepositId */}
                {(watchedCountryOfDepositId !== undefined && watchedCountryOfDepositId !== null) && (
                    <SelectWithLabel<TransferRequestSchemaType>
                        fieldTitle={t('currency')}
                        nameInSchema="currencyId"
                        data={currencyOptions}
                        control={form.control}
                        placeholderHint={t('selectCurrencyPlaceholder')}
                    />
                )}

                {/* Amount, Rate, Remark Inputs - Conditional on Currency Selection */}
                {/* Check for non-undefined/null on watchedCurrencyId */}
                {(watchedCurrencyId !== undefined && watchedCurrencyId !== null) && (
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
