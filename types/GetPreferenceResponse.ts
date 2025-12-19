// types/preferences/GetPreferencePayload.ts

export interface GetPreferencePayload {
    identifier: "email" | "phoneNumber";
    email?: string;
    phoneNumber?: string;
    key: string;
}
