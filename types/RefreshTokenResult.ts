// /home/amos/docure/ngtransfert_admin/types/RefreshTokenResult.ts
import {BffUser} from "./session";

export type RefreshTokenResult =
    | {
    success: true;
    accessToken: string;
    expiresAt: number;
    user: BffUser; // or your BffUser type if available
}
    | {
    success: false;
};

