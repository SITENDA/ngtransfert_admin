import jwt from "jsonwebtoken";

interface CreateBffTokenInput {
    userId: number | string;
    sessionId: string;
}

export function createBffToken({ userId, sessionId }: CreateBffTokenInput) {
    return jwt.sign(
        {
            typ: "BFF",
            uid: userId,
            sid: sessionId,
        },
        process.env.BFF_SHARED_SECRET!,
        {
            subject: String(userId), // 🔥 REQUIRED
            algorithm: "HS256",
            expiresIn: "30s",
            issuer: "ngtransfert-bff",
            audience: "ngtransfert-backend",
        }
    );
}