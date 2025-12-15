export function decodeJwtExpiry(token: string): number | undefined {
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload.exp ? payload.exp * 1000 : undefined;
    } catch {
        return undefined;
    }
}