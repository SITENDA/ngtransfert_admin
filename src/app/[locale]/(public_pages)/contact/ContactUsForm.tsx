"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { contactUsSchema, type contactUsSchemaType } from "@/zod-schemas/contact-us"; // Create this schema
import { useAction } from 'next-safe-action/hooks';
import { sendContactUsEmailAction } from "@/lib/actions/sendContactUsEmailAction"; // Create this action
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { useState } from "react";

type Props = {
    content: {
        emailTitle: string,
        emailPlaceholder: string,
        messageTitle: string,
        messagePlaceholder: string,
        sendButtonTitle: string,
        loadingLabel: string,
        reset: string
    }
}

export default function ContactUsForm({ content } : Props) {
    const { toast } = useToast();
    const [setSuccessMessage] = useState<string | null>(null);

    const emptyValues: contactUsSchemaType = {
        email: '',
        message: '',
    };

    const form = useForm<contactUsSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(contactUsSchema),
        defaultValues: emptyValues,
    });

    const {
        execute: executeSend,
        result: sendResult,
        isPending: isSending,
        reset: resetSendAction,
    } = useAction(sendContactUsEmailAction, {
        onSuccess({ data }) {
            if (data?.message) {
                toast({
                    variant: "default",
                    title: "Success! 🎉",
                    description: data.message,
                });
                setSuccessMessage(data.message);
                form.reset(emptyValues); // Clear the form on success
            }
        },
        onError({ error }) {
            console.log("error", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Message Failed to Send", // More generic message
            });
        },
    });

    async function submitForm(data: contactUsSchemaType) {
        executeSend(data);
    }

    return (
        <div className="flex flex-col gap-1 mt-4 sm:px-8 relative"> {/* Relative for positioning */}
            <div className="absolute inset-0 bg-[#230a84]/50 rounded-lg -z-50"></div> {/* Semi-transparent overlay */}
            <div className="relative z-10 p-6 bg-black/50 rounded-lg"> {/* Form container with padding, background, and rounded corners */}
                <DisplayServerActionResponse result={sendResult} />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="flex flex-col gap-4">
                        <InputWithLabel<contactUsSchemaType>
                            fieldTitle={ content.emailTitle }
                            nameInSchema="email"
                            placeholder={ content.emailPlaceholder } // Add placeholder
                            type="email" // Specify input type
                        />

                        <TextAreaWithLabel<contactUsSchemaType>
                            fieldTitle={content.messageTitle}
                            nameInSchema="message"
                            className="h-40"
                            placeholder={content.messagePlaceholder}
                        />

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title={content.sendButtonTitle}
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <LoaderCircle className="animate-spin" /> {content.loadingLabel}
                                    </>
                                ) : content.sendButtonTitle}
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                title={content.reset}
                                onClick={() => {
                                    form.reset(emptyValues);
                                    resetSendAction();
                                    setSuccessMessage(null); // Clear success message on reset
                                }}
                            >
                                {content.reset}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );


}