//  src/lib/createBffToken.ts

import jwt from "jsonwebtoken";
import { UserIdentifierType } from "../../types/UserIdentifier";

interface CreateBffTokenInput {
    identifierType: UserIdentifierType;
    identifierValue: string | number;
    sessionId: string;
}

export function createBffToken({
                                   identifierType,
                                   identifierValue,
                                   sessionId,
                               }: CreateBffTokenInput) {
    return jwt.sign(
        {
            typ: "BFF",
            idt: identifierType,
            idv: identifierValue,
            sid: sessionId,
        },
        process.env.BFF_SHARED_SECRET!,
        {
            subject: String(identifierValue),
            algorithm: "HS256",
            expiresIn: "30s",
            issuer: "ngtransfert-bff",
            audience: "ngtransfert-backend",
        }
    );
}