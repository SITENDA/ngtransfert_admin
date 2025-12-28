// types/backend/login.ts
import {BffUser} from "./session";

// export interface BackendLoginPayload {
//     token: string; // ✅ matches backend
//     user: {
//         userId: number;
//         email: string;
//         username: string;
//         fullName?: string;
//         profileImageUrl?: string;
//         enabled: boolean;
//         roles: Array<{ roleId: number; roleName: string }>;
//         ekiddako: "nnyinimu" | "kaasitoma" | string;
//     };
// }
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
    accessTokenExpiresAt: number; // epoch millis
}
