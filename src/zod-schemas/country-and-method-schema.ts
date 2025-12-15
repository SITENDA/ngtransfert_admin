// src/zod-schemas/request-details-schema.ts
import { z } from "zod";
import {ReceiverAccountCategoryEnum} from "@/zod-schemas/receiver-account";
import {TopUpMethodEnum} from "@/enums/TopUpMethodEnum";
// import {TopUpMethodEnum} from "@/hooks/useOrderedTopUpMethods";

export const CountryAndMethodSchema = z.object({
    receiverAccountCategory: z.nativeEnum(ReceiverAccountCategoryEnum.enum), // must be backend enum compatible
    accountIdentifier: z.string().min(1, "Account Identifier is required."),
    accountId: z.coerce.number().int().positive("Account ID must be a positive integer."),
    countryOfDepositId: z.coerce.number().int().positive("Country of Deposit ID must be a positive integer."),
    topUpMethod: z.nativeEnum(TopUpMethodEnum),
});

export type CountryAndMethodSchemaType = z.infer<typeof CountryAndMethodSchema>;