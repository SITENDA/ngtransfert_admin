// types/BackendRegisterPayload.ts

export interface NewlyRegisteredUser {
    userId: number;
    email: string;
    fullName: string;
    username: string;
    isNewClient: boolean;
}

export interface BackendRegisterPayload {
    user: NewlyRegisteredUser
}
