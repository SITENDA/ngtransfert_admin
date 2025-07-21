// src/lib/backend-api-client.ts
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import {BackendHttpResponse, ErrorBody, ErrorResponse} from "../../types/BackendHttpResponse";
import getSession from "@/lib/getSession";
import {RefreshApiResponse} from "../../types/RefreshApiResponse";

type FetchBackendResult<T> = T | { redirectTo: string } | null;

function getFullLogoutRedirect(locale: string): { redirectTo: string } {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const signoutUrl = `${baseUrl}/api/auth/signout?callbackUrl=/${locale}/login?forceSignOut=true`;
    return { redirectTo: signoutUrl };
}




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

    let accessToken: string | null = session?.accessToken;

    const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';
    const fullUrl = `${backendApiBaseUrl}${endpoint}`;

    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');

    const makeFetchRequest = async (token: string | null): Promise<Response> => {
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader && { 'Cookie': cookieHeader }),
            },
            next: { revalidate: revalidateSeconds }
        };

        if (token) {
            fetchOptions.headers = {
                ...fetchOptions.headers,
                'Authorization': `Bearer ${token}`,
            };
        }

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            fetchOptions.body = JSON.stringify(body);
        }

        return await fetch(fullUrl, fetchOptions);
    };

    const refreshAccessToken = async (): Promise<string | null> => {
        console.info('fetchBackendData: Attempting to refresh access token...');
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = headersList.get('host');
        const currentHost = host || (process.env.NODE_ENV === 'development' ? 'localhost:3000' : null);
        if (!currentHost) {
            console.error('fetchBackendData: Host header missing and no fallback for refresh endpoint.');
            return null;
        }

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
                const refreshErrorBody: ErrorBody = await refreshResponse.json().catch(() => ({ message: 'Error during refresh parse' }));
                console.error('fetchBackendData: Token refresh failed:', refreshResponse.status, refreshErrorBody.error_message);
                return null;
            }

            const refreshData: RefreshApiResponse = await refreshResponse.json();

            const newAccessToken = refreshData.tokens.data?.token; // ✅ Correct path

            if (!newAccessToken) {
                console.error('fetchBackendData: No access token in refresh response.');
                return null;
            }

            console.info('fetchBackendData: Token refresh successful.');
            return newAccessToken;
        } catch (refreshError) {
            console.error('fetchBackendData: Network error or other unhandled error during token refresh:', refreshError);
            return null;
        }
    };

    let response: Response;

    // 1. Initial access token check and refresh attempt
    if (!accessToken) {
        console.warn('fetchBackendData: No access token in session. Trying to get one via refresh.');
        accessToken = await refreshAccessToken();
        if (!accessToken) {

            return { redirectTo: `/${locale}/login?forceSignOut=true` };
        }
        response = await makeFetchRequest(accessToken);
    } else {
        response = await makeFetchRequest(accessToken);
    }

    // 2. Handle 401/403 responses and second refresh attempt
    if (response.status === 401 || response.status === 403) {
        console.log("fetchBackendData: Received 401/403. About to attempt refreshing if token is expired.");
        let errorResponse: ErrorResponse | undefined;
        try {
            errorResponse = await response.json();
        } catch (e) {
            console.error("fetchBackendData: Failed to parse error response JSON on 401/403.", e);
        }

        const isAccessTokenExpired = errorResponse?.error?.includes("expired") || false;

        if (isAccessTokenExpired) {
            console.warn(`fetchBackendData: Access token expired. Retrying refresh...`);
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                // If second refresh fails after expiration, force full logout
                await getFullLogoutRedirect(locale);
            }
            response = await makeFetchRequest(accessToken);
        } else {
            // Not expired, but still unauthorized/forbidden - likely insufficient permissions or invalid token.
            // Force full logout
            const finalErrorBody: ErrorResponse = errorResponse || (await response.json().catch(() => ({ message: 'Error parsing response' })));
            console.error(`fetchBackendData: Final fetch error: ${response.status}`, finalErrorBody);
            await getFullLogoutRedirect(locale);
        }
    }

    // 3. Final check of response status after all attempts
    if (!response.ok) {
        return { redirectTo: `/${locale}/login?forceSignOut=true` };
    }

    const backendResponse: BackendHttpResponse<T> = await response.json();

    if (backendResponse.statusCode === 200 && backendResponse.data !== undefined && backendResponse.data !== null) {
        return backendResponse.data;
    } else {
        console.warn(`fetchBackendData: Backend responded but data/status invalid`, backendResponse);
        // If backend indicates a non-200 status code or missing data, force full logout.
        await getFullLogoutRedirect(locale);
    }

    if (backendResponse.statusCode !== 200 || !backendResponse.data) {
        return { redirectTo: `/${locale}/login?forceSignOut=true` };
    }

    return backendResponse.data;
}