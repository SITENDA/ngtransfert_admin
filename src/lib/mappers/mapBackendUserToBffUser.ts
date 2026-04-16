// src/lib/mappers/mapBackendUserToBffUser.ts


import {BackendLoginPayload} from "../../../types/BackendLoginPayload";
import {BffUser} from "../../../types/session";

export function mapBackendUserToBffUser(
    backendUser: BackendLoginPayload["user"]
): BffUser {
    return {
        userId: backendUser.userId,
        email: backendUser.email,
        username: backendUser.username,
        fullName: backendUser.fullName,
        profileImageUrl: backendUser.profileImageUrl,
        enabled: backendUser.enabled,
        roles: backendUser.roles.map(r => ({
            id: r.id ?? r.id, // 👈 handles backend naming
            roleName: r.roleName,
        })),
        ekiddako: backendUser.ekiddako, // ✅ FIX
    };
}
