import {z} from "zod";

export const UserIdentifierEnum = z.enum([
    "USERID",
    "USERNAME",
    "EMAIL",
    "NATIONAL_ID",
    "PASSPORT_NUMBER",
    "PHONE_NUMBER",
]);

export type UserIdentifierType = z.infer<typeof UserIdentifierEnum>;