// /home/amos/docure/ngtransfert_admin/types/RefreshTokenResult.ts
export type RefreshTokenResult =
    | {
    success: true;
    accessToken: string;
    expiresAt: number;
    user: unknown; // or your BffUser type if available
}
    | {
    success: false;
};

