// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/ApplyForTransferForm.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel"; // Assuming this path
import { InputWithLabel } from "@/components/inputs/InputWithLabel"; // Assuming this path
import { Button } from "@/components/ui/button"; // Assuming this path
import { Form } from "@/components/ui/form"; // Assuming this path

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Country } from "../../../../../../../types/country"; // Assuming this path
import { Currency } from "../../../../../../../types/currency"; // Assuming this path
import { TransferRequestSchema, TransferRequestSchemaType } from "@/zod-schemas/transfer-request"; // New schema
import { useOrderedCountries } from "@/hooks/useOrderedCountries"; // Hook for countries
import { useOrderedCurrencies } from "@/hooks/useOrderedCurrencies"; // Hook for currencies
import {useOrderedReceiverAccountCategories} from "@/hooks/ReceiverAccountType"; // For receiver account category data

import { createTransferRequestAction } from "@/lib/actions/transfer-request"; // Server Action

interface ApplyForTransferFormProps {
    initialCountries: Country[];
    initialCurrencies: Currency[];
    clientId: number; // Client ID passed from the Server Component
}

const ApplyForTransferForm: React.FC<ApplyForTransferFormProps> = ({ initialCountries, initialCurrencies, clientId }) => {
    const t = useTranslations('ApplyForTransferForm'); // Translations for this component
    const router = useRouter();
    const locale = useLocale();

    // Default form values, including clientId from props
    const defaultEmptyValues: TransferRequestSchemaType = {
        amount: 0,
        currencyId: null as any, // Use null for select to allow placeholder, will be validated by zod.coerce.number
        rate: 0,
        remark: '',
        receiverAccountCategory: null,
        receiverAccountId: null as any, // Use null for select to allow placeholder
        clientId: clientId, // Pre-fill clientId from props
        countryOfDepositId: null as any, // Use null for select to allow placeholder
    };

    const form = useForm<TransferRequestSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(TransferRequestSchema),
        defaultValues: defaultEmptyValues,
    });

    const watchedCountryOfDepositId = form.watch("countryOfDepositId");
    const watchedReceiverAccountCategory = form.watch("receiverAccountCategory");

    // State for the selected country object (needed for prioritizing its currency)
    const [selectedCountryObj, setSelectedCountryObj] = useState<Country | null>(null);
    const [loading, setLoading] = useState(false);

    // Filter and order countries for the SelectWithLabel
    const countryOptions = useOrderedCountries(initialCountries);
    // Filter and order currencies, prioritizing the selected country's currency
    const currencyOptions = useOrderedCurrencies(initialCurrencies, selectedCountryObj);
    const receiverAccountCategoryOptions = useOrderedReceiverAccountCategories(); // Reusing the hook for categories

    // Effect to update selectedCountryObj when watchedCountryOfDepositId changes
    useEffect(() => {
        if (watchedCountryOfDepositId) {
            const country = initialCountries.find(c => c.countryId === watchedCountryOfDepositId);
            setSelectedCountryObj(country || null);
            // Optionally, set the currencyId if a country is selected and has a currency
            if (country && country.currency) {
                form.setValue("currencyId", country.currency.currencyId, { shouldValidate: true });
            }
        } else {
            setSelectedCountryObj(null);
            form.setValue("currencyId", null as any, { shouldValidate: true }); // Clear currency if no country
        }
    }, [watchedCountryOfDepositId, initialCountries, form]);


    const onSubmit = async (data: TransferRequestSchemaType) => {
        setLoading(true);
        console.log("Applying for transfer with data:", data);

        // ClientId is already in `data` from defaultValues, but we should ensure it's correct
        // For `RequestTransferRequestDTO` you send to backend, backend will likely overwrite clientId.
        // But for client-side validation and consistent form data, it's good to include it.
        data.clientId = clientId;

        // Construct FormData for the server action if your action expects FormData,
        // or just pass the data object if your action handles JSON body directly.
        // Based on createTransferRequestAction, it expects JSON.
        const result = await createTransferRequestAction(data);

        setLoading(false);

        if (result.success) {
            alert(result.message);
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
                {/* Country of Deposit Selector */}
                <SelectWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('countryOfDeposit')}
                    nameInSchema="countryOfDepositId"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectCountryPlaceholder')}
                />

                {/* Currency Selector */}
                <SelectWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('currency')}
                    nameInSchema="currencyId"
                    data={currencyOptions}
                    control={form.control}
                    placeholderHint={t('selectCurrencyPlaceholder')}
                />

                {/* Amount Input */}
                <InputWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('amount')}
                    nameInSchema="amount"
                    control={form.control}
                    placeholder={t('amountPlaceholder')}
                    type="number" // Ensure numeric keyboard on mobile
                    step="0.01" // Allow decimal input
                />

                {/* Rate Input (if applicable to be entered by user, otherwise remove) */}
                <InputWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('rate')}
                    nameInSchema="rate"
                    control={form.control}
                    placeholder={t('ratePlaceholder')}
                    type="number"
                    step="0.0001" // Allow more precise decimal input for rate
                />

                {/* Remark Input */}
                <InputWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('remark')}
                    nameInSchema="remark"
                    control={form.control}
                    placeholder={t('remarkPlaceholder')}
                    type="text"
                />

                {/* Receiver Account Category Selector */}
                <SelectWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('receiverAccountCategory')}
                    nameInSchema="receiverAccountCategory"
                    data={receiverAccountCategoryOptions}
                    control={form.control}
                    placeholderHint={t('selectCategoryPlaceholder')}
                />

                {/* Receiver Account ID Input - NOTE: This typically would be another select,
                    fetching accounts for the selected category/client from a different endpoint.
                    For simplicity, it's an input here, but consider a dedicated ReceiverAccountSelect component. */}
                <InputWithLabel<TransferRequestSchemaType>
                    fieldTitle={t('receiverAccountId')}
                    nameInSchema="receiverAccountId"
                    control={form.control}
                    placeholder={t('receiverAccountIdPlaceholder')}
                    type="number"
                />

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
