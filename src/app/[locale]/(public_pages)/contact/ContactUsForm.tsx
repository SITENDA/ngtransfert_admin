"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import {
    contactUsSchema,
    type contactUsSchemaType,
} from "@/zod-schemas/contact-us";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import TickAnimation from "@/components/TickAnimation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {sendContactUsMessageAction} from "@/lib/actions/sendContactUsEmailAction";
import {generalPaths} from "@/util/frontend-paths";

type Props = {
    content: {
        emailTitle: string;
        emailPlaceholder: string;
        messageTitle: string;
        messagePlaceholder: string;
        sendButtonTitle: string;
        loadingLabel: string;
        reset: string;
    };
};

export default function ContactUsForm({ content }: Props) {
    const { toast } = useToast();
    const router = useRouter();

    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const emptyValues: contactUsSchemaType = {
        email: "",
        message: "",
    };

    const form = useForm<contactUsSchemaType>({
        mode: "onBlur",
        resolver: zodResolver(contactUsSchema),
        defaultValues: emptyValues,
    });

    async function submitForm(data: contactUsSchemaType) {
        setIsSending(true);

        try {
            console.log("Data entered is : ", data);
            const result = await sendContactUsMessageAction(data);

            if (!result.success) {
                toast({
                    title: "Error",
                    description: result.formErrors?.[0] ?? "Failed to send message",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success 🎉",
                description: result.message,
            });

            setSuccessMessage(result.message ?? "Message sent successfully");
            form.reset(emptyValues);

            setTimeout(() => {
                router.push(generalPaths.welcomePath);
            }, 3000);
        } finally {
            setIsSending(false);
        }
    }

    // ✅ Show success animation ONLY
    if (successMessage) {
        return <TickAnimation successMessage={successMessage} />;
    }

    return (
        <div className="flex flex-col gap-1 mt-4 sm:px-8 relative">
            <div className="absolute inset-0 bg-[#230a84]/50 rounded-lg -z-50" />

            <div className="relative z-10 p-6 bg-black/50 rounded-lg">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submitForm)}
                        className="flex flex-col gap-4"
                    >
                        <InputWithLabel<contactUsSchemaType>
                            fieldTitle={content.emailTitle}
                            nameInSchema="email"
                            placeholder={content.emailPlaceholder}
                            type="email"
                            control={form.control}
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
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <LoaderCircle className="animate-spin mr-2" />
                                        {content.loadingLabel}
                                    </>
                                ) : (
                                    content.sendButtonTitle
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    form.reset(emptyValues);
                                    setSuccessMessage(null);
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
