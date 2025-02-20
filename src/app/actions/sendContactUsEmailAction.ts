"use server";

import { z } from "zod";
import { contactUsSchema } from "@/zod-schemas/contactUs";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import getSession from "@/lib/getSession";

export const sendContactUsEmailAction = actionClient
    .metadata({ actionName: 'sendContactUsEmailAction' }) // Add metadata
    .schema(contactUsSchema) // Add schema validation
    .action(async (data) => { // No need for destructuring here
        const session = await getSession() // Get the session

        if (!session) {
            return {
                // Return an error if the user is not authenticated
                // Important: Structure to match next-safe-action error handling
                fieldErrors: {
                  email: ["You must be logged in to submit this form."],
                  message: ["You must be logged in to submit this form."],
                },
                formErrors: ["You must be logged in to submit this form."],
            };
        }

        try {
            await prisma.contactMessage.create({
                data: {
                    email: data.parsedInput.email,
                    message: data.parsedInput.message,
                },
            });

            revalidatePath('/contact-us');

            return { message: "Message sent and saved successfully!" };
        } catch (error) {
            console.error("Error saving contact message:", error);
            return { message: "Failed to save message." };
        }
    });