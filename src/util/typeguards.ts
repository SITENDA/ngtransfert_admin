export function isRedirectObject<T>(value: T | { redirectTo: string } | null): value is { redirectTo: string } {
    return !!value && typeof value === 'object' && 'redirectTo' in value;
}