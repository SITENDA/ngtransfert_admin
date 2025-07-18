// @/lib/fetchBackendData.ts
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import {BackendHttpResponse, ErrorBody, ErrorResponse} from "../../types/BackendHttpResponse";
import getSession from "@/lib/getSession"; // Ensure this import is correct

/**
 * Helper function to handle full logout and redirect
 * @param {string} locale
 * @returns {Promise<never>} - This function will always redirect, so it won't return
 */
async function performFullLogoutAndRedirect(locale: string): Promise<never> {
    console.error(`fetchBackendData: Token issue detected. Performing full logout.`);
    const myHeaders = await headers();
    // Construct the URL to NextAuth's signout endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://${myHeaders.get('host')}`;
    const signoutUrl = `${baseUrl}/api/auth/signout?callbackUrl=/${locale}/login`;

    // Perform a server-side redirect to the NextAuth signout endpoint
    // NextAuth will handle clearing the cookies and then redirecting to callbackUrl
    redirect(signoutUrl);
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
): Promise<T | null> {
    const session = await getSession();
    const locale = await getLocale();

    let accessToken = session?.accessToken;

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

            const refreshData: { tokens?: { accessToken: string; refreshToken: string; }; message?: string; } = await refreshResponse.json();
            const newAccessToken = refreshData?.tokens?.accessToken;

            if (!newAccessToken) {
                console.error('fetchBackendData: No new access token received during refresh data.');
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
            // If initial refresh fails, force full logout
            await performFullLogoutAndRedirect(locale);
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
                await performFullLogoutAndRedirect(locale);
            }
            response = await makeFetchRequest(accessToken);
        } else {
            // Not expired, but still unauthorized/forbidden - likely insufficient permissions or invalid token.
            // Force full logout
            const finalErrorBody: ErrorResponse = errorResponse || (await response.json().catch(() => ({ message: 'Error parsing response' })));
            console.error(`fetchBackendData: Final fetch error: ${response.status}`, finalErrorBody);
            await performFullLogoutAndRedirect(locale);
        }
    }

    // 3. Final check of response status after all attempts
    if (!response.ok) {
        const errorBody: ErrorBody = await response.json().catch(() => ({ message: 'Error parsing response' }));
        console.error(`fetchBackendData: Final fetch error after all attempts: ${response.status}`, errorBody.error_message);
        await performFullLogoutAndRedirect(locale);
    }

    const backendResponse: BackendHttpResponse<T> = await response.json();

    if (backendResponse.statusCode === 200 && backendResponse.data !== undefined && backendResponse.data !== null) {
        return backendResponse.data;
    } else {
        console.warn(`fetchBackendData: Backend responded but data/status invalid`, backendResponse);
        // If backend indicates a non-200 status code or missing data, force full logout.
        await performFullLogoutAndRedirect(locale);
    }
}


//TODO: I need to add a client component to use to unset session data, which will be a direct inverse of how I set the data, because I set the data
// using the redirect page and its client component, now I need a client component to help in unsetting that data.