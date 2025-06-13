// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/ApplyForTransferForm.tsx
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
import { Currency } from "../../../../../../../types/currency";
import { TransferRequestSchema, TransferRequestSchemaType } from "@/zod-schemas/transfer-request";
import { useOrderedCountries } from "@/hooks/useOrderedCountries";
import { useOrderedCurrencies } from "@/hooks/useOrderedCurrencies";

import { createTransferRequestAction } from "@/lib/actions/transfer-request"; // Server Action

interface ApplyForTransferFormProps {
    initialCountries: Country[];
    initialCurrencies: Currency[];
    clientId: number; // Client ID passed from the Server Component
}

const ApplyForTransferForm: React.FC<ApplyForTransferFormProps> = ({ initialCountries, initialCurrencies, clientId }) => {
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
        receiverAccountCategory: undefined,
        receiverAccountId: undefined,
        clientId: clientId, // Pre-fill clientId from props
        countryOfDepositId: undefined,
    };

    const form = useForm<TransferRequestSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(TransferRequestSchema),
        defaultValues: defaultEmptyValues,
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
        if (watchedCountryOfDepositId) {
            const country = initialCountries.find(c => c.countryId === watchedCountryOfDepositId);
            setSelectedCountryObj(country || null);
            // Optionally, set the currencyId if a country is selected and has a currency
            if (country && country.currency) {
                // Only set value if it's different to avoid unnecessary re-renders/validation
                if (form.getValues("currencyId") !== country.currency.currencyId) {
                    // Removed shouldValidate: true here
                    form.setValue("currencyId", country.currency.currencyId, { shouldDirty: true });
                }
            } else {
                // If country is selected but has no currency, or country object is null/undefined
                // Removed shouldValidate: true here
                form.setValue("currencyId", undefined, { shouldDirty: true }); // Clear currency
            }
        } else {
            // Reset currency and all subsequent fields if country is unselected/reset
            setSelectedCountryObj(null);
            // Removed shouldValidate: true from all these setValue calls
            form.setValue("currencyId", undefined, { shouldDirty: true });
            form.setValue("amount", undefined, { shouldDirty: true });
            form.setValue("rate", undefined, { shouldDirty: true });
            form.setValue("remark", undefined, { shouldDirty: true });
            form.setValue("receiverAccountCategory", undefined, { shouldDirty: true });
            form.setValue("receiverAccountId", undefined, { shouldDirty: true });
        }
    }, [watchedCountryOfDepositId, initialCountries, form]);

    // Effect to reset dependent fields when currency is unselected
    useEffect(() => {
        // This effect runs if watchedCurrencyId becomes undefined/null, but only if a country is still selected.
        // If countryOfDepositId is also undefined, the previous useEffect handles the full reset.
        if (!watchedCurrencyId && watchedCountryOfDepositId) {
            // Removed shouldValidate: true from all these setValue calls
            form.setValue("amount", undefined, { shouldDirty: true });
            form.setValue("rate", undefined, { shouldDirty: true });
            form.setValue("remark", undefined, { shouldDirty: true });
            form.setValue("receiverAccountCategory", undefined, { shouldDirty: true });
            form.setValue("receiverAccountId", undefined, { shouldDirty: true });
        }
    }, [watchedCurrencyId, watchedCountryOfDepositId, form]);

    const onSubmit = async (data: TransferRequestSchemaType) => {
        setLoading(true);
        console.log("Applying for transfer with data:", data);

        // ClientId is pre-filled from defaultValues, and will be set securely by the backend
        data.clientId = clientId;

        // Call the server action to create the transfer request
        const result = await createTransferRequestAction(data);

        setLoading(false);

        if (result.success) {
            alert(t('transferSuccessMessage', { message: result.message }));
            form.reset(defaultEmptyValues); // Reset form to initial empty state
            const redirectPath = `/${locale}/kaasitoma/transfer-requests`; // Redirect to the list of transfer requests
            router.push(redirectPath);
        } else {
            alert(`${t('submissionError')}: ${result.message}`);
            console.error('Transfer request submission failed:', result.message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md">
                {/* Country of Deposit Selector - Always Visible */}
                <SelectWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('countryOfDeposit')}
                    nameInSchema="countryOfDepositId"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectCountryPlaceholder')}
                />

                {/* Currency Selector - Conditional on Country Selection */}
                {watchedCountryOfDepositId && (
                    <SelectWithLabel<TransferRequestSchemaType>
                        fieldTitle={t('currency')}
                        nameInSchema="currencyId"
                        data={currencyOptions}
                        control={form.control}
                        placeholderHint={t('selectCurrencyPlaceholder')}
                    />
                )}

                {/* Amount, Rate, Remark, Receiver Account Category, and Receiver Account ID Inputs
                    - Conditional on Currency Selection */}
                {watchedCurrencyId && (
                    <>
                        <InputWithLabel<TransferRequestSchemaType>
                            fieldTitle={t('amount')}
                            nameInSchema="amount"
                            control={form.control}
                            placeholder={t('amountPlaceholder')}
                            type="number"
                            step="0.01" // Allow decimal input
                        />

                        <InputWithLabel<TransferRequestSchemaType>
                            fieldTitle={t('rate')}
                            nameInSchema="rate"
                            control={form.control}
                            placeholder={t('ratePlaceholder')}
                            type="number"
                            step="0.0001" // Allow more precise decimal input for rate
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
