// types/backend/login.ts
export interface BackendLoginPayload {
    user: {
        userId: number;
        email: string;
        username: string;
        fullName?: string;
        profileImageUrl?: string;
        enabled: boolean;
        roles: Array<{ id: number; roleName: string }>;
        ekiddako: string;
    };
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
}
