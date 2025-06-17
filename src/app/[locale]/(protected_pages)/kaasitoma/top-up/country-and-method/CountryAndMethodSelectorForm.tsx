// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/CountryAndMethodSelectorForm.tsx
"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Form } from "@/components/ui/form";
import { ReceiverAccount } from "../../../../../../../types/receiver-account";
import { CountryAndMethodSchema, CountryAndMethodSchemaType } from "@/zod-schemas/country-and-method-schema";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { useOrderedCountries } from "@/hooks/useOrderedCountries";
import { Country } from "../../../../../../../types/country";
import { useOrderedTopUpMethods } from "@/hooks/useOrderedTopUpMethods";
import { Button } from "@/components/ui/button";
import {handleCountryAndMethodSelection} from "@/lib/actions/country-and-method-actions";


interface CountryAndMethodSelectorFormProps {
    initialCountries: Country[];
    initialReceiverAccount: ReceiverAccount;
}

const CountryAndMethodSelectorForm: React.FC<CountryAndMethodSelectorFormProps> = ({ initialCountries, initialReceiverAccount }) => {
    const t = useTranslations('CountryAndMethodSelectorForm');
    const router = useRouter();

    const countryOptions = useOrderedCountries(initialCountries);
    const topUpMethodOptions = useOrderedTopUpMethods();

    const defaultFormValues: CountryAndMethodSchemaType = {
        receiverAccountCategory: initialReceiverAccount.receiverAccountCategory,
        accountIdentifier: initialReceiverAccount.receiverAccountIdentifier,
        accountId: initialReceiverAccount.receiverAccountId,
        countryOfDepositId: undefined as unknown as number,
        topUpMethod: undefined as unknown as CountryAndMethodSchemaType['topUpMethod'],
    };

    const form = useForm<CountryAndMethodSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(CountryAndMethodSchema),
        defaultValues: defaultFormValues,
    });

    const onSubmit = async (data: CountryAndMethodSchemaType) => {
        console.log("DEBUG: CountryAndMethodSelectorForm - Form data prepared for submission:", data);

        try {
            const result = await handleCountryAndMethodSelection(data); // Call the server action

            console.log("DEBUG: CountryAndMethodSelectorForm - Server action result:", result);

            if (result.success) {
                if (result.redirectUrl) {
                    router.push(result.redirectUrl); // Client-side navigation to the server page
                } else {
                    alert(t('topUpSuccessMessage', { message: result.message || 'Selection successful!' }));
                }
            } else {
                alert(`${t('submissionError')}: ${result.message}`);
                console.error('ERROR: Country and Method selection failed:', result.message);
            }
        } catch (error) {
            console.error("CRITICAL ERROR: CountryAndMethodSelectorForm - Exception during server action call:", error);
            alert(`${t('submissionError')}: An unexpected error occurred during selection submission.`);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <input type="hidden" {...form.register("receiverAccountCategory")} />
                <input type="hidden" {...form.register("accountIdentifier")} />
                <input type="hidden" {...form.register("accountId")} />

                <SelectWithLabel<CountryAndMethodSchemaType>
                    fieldTitle={t('countryOfDeposit')}
                    nameInSchema="countryOfDepositId"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectCountryPlaceholder')}
                />

                <SelectWithLabel<CountryAndMethodSchemaType>
                    fieldTitle={t('topUpMethod')}
                    nameInSchema="topUpMethod"
                    data={topUpMethodOptions}
                    control={form.control}
                    placeholderHint={t('selectTopUpMethodPlaceholder')}
                />

                <Button type="submit">{t('continueButton')}</Button>
            </form>
        </Form>
    );
};

export default CountryAndMethodSelectorForm;