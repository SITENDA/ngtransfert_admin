"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { contactUsSchema, type contactUsSchemaType } from "@/zod-schemas/contactUs"; // Create this schema
import { useAction } from 'next-safe-action/hooks';
import { sendContactUsEmailAction } from "@/app/actions/sendContactUsEmailAction"; // Create this action
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { useState } from "react";


export default function ContactUsForm() {
    const { toast } = useToast();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
                            fieldTitle="Email"
                            nameInSchema="email"
                            placeholder="your@email.com" // Add placeholder
                            type="email" // Specify input type
                        />

                        <TextAreaWithLabel<contactUsSchemaType>
                            fieldTitle="Message"
                            nameInSchema="message"
                            className="h-40"
                            placeholder="Your message here..." // Add placeholder
                        />

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="Send"
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <LoaderCircle className="animate-spin" /> Sending...
                                    </>
                                ) : "Send"}
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => {
                                    form.reset(emptyValues);
                                    resetSendAction();
                                    setSuccessMessage(null); // Clear success message on reset
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );


}