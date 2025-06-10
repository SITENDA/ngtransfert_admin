// Your AddReceiverAccount component file
"use client"

import {SelectWithLabel} from "@/components/inputs/SelectWithLabel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {useSearchParams} from "next/navigation";

// --- IMPORTANT: Update Imports ---
// Import everything related to ReceiverAccount from the single schema file
import {
    ReceiverAccountSchema,
    ReceiverAccountSchemaType,
    ReceiverAccountCategoryEnum, // Import the Zod enum instance
    ReceiverAccountIdentifierEnum, // Import the Zod enum instance
    ReceiverAccountCategoryType, // Import the inferred TS type
    ReceiverAccountIdentifierType // Import the inferred TS type
} from "@/zod-schemas/receiver-account"; // Corrected path from @//zod-schemas to @/lib/schemas

import {orderedReceiverAccountTypes} from "@/constants/ReceiverAccountType";
import PublicWrapper from "@/components/PublicWrapper";
import { Button } from "@/components/ui/button"; // Assuming you have Button for submission
import { InputWithLabel } from "@/components/inputs/InputWithLabel"; // Assuming you have an InputWithLabel


// Define the type for the `receiverAccount` prop based on what your backend sends
// This should match your Java RequestReceiverAccountDTO structure, but with TypeScript types
interface ReceiverAccountPropsFromBackend {
    receiverAccountName: string;
    receiverAccountCategory: ReceiverAccountCategoryType; // Use the inferred type
    clientId: number;
    receiverAccountIdentifier: ReceiverAccountIdentifierType; // Use the inferred type
    qrCodeImage?: string; // If backend sends a URL, not a File object
    email?: string;
    phoneNumber?: string;
    bankAccountNumber?: string; // Can be string for large numbers
    bankId?: number;
    countryId?: number;
    cardHolderName?: string;
    bankName?: string;
}

type Props = {
    receiverAccount?: ReceiverAccountPropsFromBackend; // Make prop optional for "add" mode
}

function AddReceiverAccount({ receiverAccount }: Props ) {

    const searchParams = useSearchParams()
    const hasReceiverAccountId = searchParams.has("receiverAccountId")

    // --- Corrected Default Values ---
    const emptyValues: ReceiverAccountSchemaType = {
        receiverAccountName: '',
        receiverAccountCategory: ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT, // Use .enum.<VALUE>
        clientId: 0, // Default to a valid number, or make it optional in schema if 0 is not valid
        receiverAccountIdentifier: ReceiverAccountIdentifierEnum.enum.EMAIL, // Use .enum.<VALUE>
        qrCodeImage: null, // Default for File input is null
        email: '',
        phoneNumber: '',
        bankAccountNumber: '',
        // Use null for optional numbers if schema allows null, or undefined
        bankId: null,
        countryId: null,
        cardHolderName: '',
        bankName: ''
    }

    const defaultValues: ReceiverAccountSchemaType = hasReceiverAccountId && receiverAccount ? {
        receiverAccountName: receiverAccount.receiverAccountName ?? '',
        // Cast backend string values to the Zod enum types for default values
        receiverAccountCategory: receiverAccount.receiverAccountCategory ?? ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
        clientId: receiverAccount.clientId ?? 0,
        receiverAccountIdentifier: receiverAccount.receiverAccountIdentifier ?? ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER,
        qrCodeImage: null, // File inputs typically don't pre-fill from URLs; handle separately
        email: receiverAccount.email ?? '',
        phoneNumber: receiverAccount.phoneNumber ?? '',
        bankAccountNumber: receiverAccount.bankAccountNumber ?? '',
        bankId: receiverAccount.bankId ?? null, // Use null for default if schema allows null
        countryId: receiverAccount.countryId ?? null, // Use null for default if schema allows null
        cardHolderName: receiverAccount.cardHolderName ?? '',
        bankName: receiverAccount.bankName ?? ''
    } : emptyValues

    const form = useForm<ReceiverAccountSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(ReceiverAccountSchema),
        defaultValues,
    });

    const onSubmit = (data: ReceiverAccountSchemaType) => {
        console.log("Form submitted with data:", data);
        // Here you would send `data` to your backend
        // Remember to handle file uploads (qrCodeImage) using FormData for your API call
    };

    return (
        <PublicWrapper>
            {/* Added styling for semi-transparent background and centering */}
            <div className="
                w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Add Receiver Account</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <SelectWithLabel<ReceiverAccountSchemaType>
                            fieldTitle="Receiver account type"
                            nameInSchema="receiverAccountCategory"
                            data={orderedReceiverAccountTypes}
                            // control={form.control} {/* IMPORTANT: Uncommented this line */}
                        />

                        <InputWithLabel<ReceiverAccountSchemaType>
                            fieldTitle="Receiver Account Name"
                            nameInSchema="receiverAccountName"
                            control={form.control}
                            placeholder="e.g., My Alipay Account"
                        />

                        {/* Conditional rendering for other fields based on identifier/category */}
                        {form.watch("receiverAccountIdentifier") === ReceiverAccountIdentifierEnum.enum.EMAIL && (
                            <InputWithLabel<ReceiverAccountSchemaType>
                                fieldTitle="Email"
                                nameInSchema="email"
                                control={form.control}
                                placeholder="receiver@example.com"
                            />
                        )}

                        {form.watch("receiverAccountIdentifier") === ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER && (
                            <InputWithLabel<ReceiverAccountSchemaType>
                                fieldTitle="Phone Number"
                                nameInSchema="phoneNumber"
                                control={form.control}
                                placeholder="e.g., +861234567890"
                            />
                        )}

                        {/* Add other fields as needed based on logic */}
                        {/* Example for bank details if category is BANK_ACCOUNT */}
                        {form.watch("receiverAccountCategory") === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT && (
                            <>
                                <InputWithLabel<ReceiverAccountSchemaType>
                                    fieldTitle="Bank Account Number"
                                    nameInSchema="bankAccountNumber"
                                    control={form.control}
                                    placeholder="e.g., 1234567890"
                                />
                                <InputWithLabel<ReceiverAccountSchemaType>
                                    fieldTitle="Bank Name"
                                    nameInSchema="bankName"
                                    control={form.control}
                                    placeholder="e.g., Industrial and Commercial Bank of China"
                                />
                                <InputWithLabel<ReceiverAccountSchemaType>
                                    fieldTitle="Card Holder Name"
                                    nameInSchema="cardHolderName"
                                    control={form.control}
                                    placeholder="e.g., John Doe"
                                />
                                {/* Add inputs for bankId and countryId if needed */}
                            </>
                        )}


                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </PublicWrapper>
    )
}

export default AddReceiverAccount