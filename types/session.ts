// /home/amos/docure/ngtransfert_admin/types/session.ts

export interface BffRole {
    id: number;
    roleName: string;
}

export interface BffUser {
    userId: number;
    username: string;
    email: string;
    fullName?: string;
    profileImageUrl?: string;
    enabled: boolean;
    roles: BffRole[];
    ekiddako: "nnyinimu" | "kaasitoma" | string;
}

export interface Session {
    sessionId: string;
    user: BffUser;

    accessToken: string;
    accessTokenExpiresAt: number; // JWT exp (ms)

    lastActivityAt: number; // 🔑 NEW: sliding session
    createdAt: number;
}
