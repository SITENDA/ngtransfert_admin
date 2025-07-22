// src/lib/backend-api-client.ts
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import {BackendHttpResponse, ErrorBody, ErrorResponse} from "../../types/BackendHttpResponse";
import getSession from "@/lib/getSession";
import {RefreshApiResponse} from "../../types/RefreshApiResponse";
import {FetchBackendResult} from "../../types/fetchBackendResult";

/**
 * Fetches data from the backend API with authentication headers and robust error handling.
 * Automatically attempts token refresh if the original request fails due to an expired token,
 * or if no access token is present initially (relying on refresh token from cookies).
 *
 * @template T
 * @param {string} endpoint
 * @param {string} method
 * @param {any} [body]
 * @param {number} [revalidateSeconds]
 * @returns {Promise<T | null>}
 */
export async function fetchBackendData<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    revalidateSeconds: number = 60 * 60
): Promise<FetchBackendResult<T>> {
    const session = await getSession();
    const locale = await getLocale();

    let accessToken: string | { redirectTo: string } | null | undefined = session?.accessToken;

    const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';
    const fullUrl = `${backendApiBaseUrl}${endpoint}`;

    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');

    const makeFetchRequest = async (token: string): Promise<Response> => {
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader && { 'Cookie': cookieHeader }),
                'Authorization': `Bearer ${token}`,
            },
            next: { revalidate: revalidateSeconds }
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            fetchOptions.body = JSON.stringify(body);
        }

        return fetch(fullUrl, fetchOptions);
    };

    const refreshAccessToken = async (): Promise<string | { redirectTo: string } | null> => {
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = headersList.get('host');
        const currentHost = host || 'localhost:3000';
        const refreshEndpoint = `${protocol}://${currentHost}/api/auth/refresh`;

        try {
            const refreshResponse = await fetch(refreshEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
                }
            });

            if (!refreshResponse.ok) {
                const errorBody: ErrorBody = await refreshResponse.json().catch(() => ({ message: 'Error parsing refresh response' }));
                console.error('Refresh failed:', errorBody);
                return null;
            }

            const refreshData: RefreshApiResponse = await refreshResponse.json();
            const newToken = refreshData.tokens.data?.token;

            if (!newToken) return null;

            const encodedToken = encodeURIComponent(newToken);
            const encodedUser = encodeURIComponent(JSON.stringify(refreshData.tokens.data.user));
            return { redirectTo: `/${locale}/auth/session/update?token=${encodedToken}&user=${encodedUser}` };

        } catch (error) {
            console.error('Token refresh error:', error);
            return null;
        }
    };

    let response: Response;

    // Step 1: No access token? Try to refresh.
    if (!accessToken) {
        const refreshed = await refreshAccessToken();

        if (typeof refreshed === 'object' && refreshed?.redirectTo) {
            return refreshed;
        }

        if (!refreshed || typeof refreshed !== 'string') {
            return { redirectTo: `/${locale}/login?forceSignOut=true` };
        }

        accessToken = refreshed;
    }

    // Step 2: Try the actual request
    response = await makeFetchRequest(accessToken as string);

    // Step 3: Handle token expiration
    if ([401, 403].includes(response.status)) {
        let errorData: ErrorResponse | undefined;

        try {
            errorData = await response.json();
        } catch {
            console.warn("Unable to parse error JSON");
        }

        const isExpired = errorData?.error?.includes("expired") ?? false;

        if (isExpired) {
            const refreshed = await refreshAccessToken();

            if (typeof refreshed === 'object' && refreshed?.redirectTo) {
                return refreshed;
            }

            if (!refreshed || typeof refreshed !== 'string') {
                return { redirectTo: `/${locale}/login?forceSignOut=true` };
            }

            accessToken = refreshed;
            response = await makeFetchRequest(accessToken);
        } else {
            return { redirectTo: `/${locale}/login?forceSignOut=true` };
        }
    }

    if (!response.ok) {
        return { redirectTo: `/${locale}/login?forceSignOut=true` };
    }

    const backendResponse: BackendHttpResponse<T> = await response.json();

    if (backendResponse.statusCode === 200 && backendResponse.data != null) {
        return backendResponse.data;
    }

    return { redirectTo: `/${locale}/login?forceSignOut=true` };
}