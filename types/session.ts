// /home/amos/docure/ngtransfert_admin/types/session.ts

export interface BffRole {
    id: number;
    roleName: string;
}

export interface BffUser {
    userId: number;
    fullName?: string;
    username: string;
    email: string;
    roles: BffRole[];
    phoneNumber: string;
    registrationDate: string;
    profileImageUrl?: string;
    enabled: boolean;
    // Routing / domain role
    ekiddako: "nnyinimu" | "kaasitoma" | string;
}

export interface Session {
    sessionId: string;
    user: BffUser;

    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number; // epoch ms
    createdAt: number;
}

export interface BffSession {
    sessionId: string;
    createdAt: number;

    user: BffUser;

    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
}