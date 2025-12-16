// /home/amos/docure/ngtransfert_admin/types/RefreshTokenResult.ts
export interface RefreshTokenResult {
    success: boolean;
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
}

