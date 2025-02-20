import { z } from "zod";

export const contactUsSchema = z.object({
  email: z.string().email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type contactUsSchemaType = z.infer<typeof contactUsSchema>;