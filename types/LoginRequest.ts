//  types/LoginRequest.ts

import { z } from "zod";
import { UserIdentifierEnum } from "./UserIdentifier";
import type { UserIdentifierType } from "./UserIdentifier";

export const LoginRequestSchema = z.object({
    identifier: UserIdentifierEnum,
    email: z.string().optional().default(""),
    phoneNumber: z.string().optional().default(""),
    password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export interface BffIdentityFromLogin {
    identifierType: UserIdentifierType;
    identifierValue: string;
}

export function getBffIdentityFromLogin(body: LoginRequest): BffIdentityFromLogin {
    switch (body.identifier) {
        case "EMAIL":
            return {
                identifierType: "EMAIL",
                identifierValue: body.email.trim(),
            };

        case "PHONE_NUMBER":
            return {
                identifierType: "PHONE_NUMBER",
                identifierValue: body.phoneNumber.trim(),
            };

        default:
            throw new Error(`Unsupported login identifier: ${body.identifier}`);
    }
}