// types/BackendLoginPayload.ts

export interface FullUser {
    userId: number;
    email: string;
    username: string;
    fullName: string;
    profileImageUrl: string;
    enabled: boolean;
    roles: Array<{ id: number; roleName: string }>;
    ekiddako: string;
}

export interface BackendLoginPayload {
    user: FullUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
}
