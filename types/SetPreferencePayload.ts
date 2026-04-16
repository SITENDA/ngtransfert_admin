// types/preferences/SetPreferencePayload.ts

export interface SetPreferencePayload {
    identifier: "email" | "phoneNumber";
    email?: string;
    phoneNumber?: string;
    key: string;
    value: string;
}
