import getSession from "@/lib/getSession";
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import {BackendHttpResponse, ErrorResponse} from "../../types/BackendHttpResponse";

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

    // Initial check for session validity, but don't immediately redirect if accessToken is null.
    // We'll try to refresh first.
    if (!session || !session.user || !session.user.userId) {
        console.warn(`fetchBackendData: No valid user session found. Attempting refresh if cookies exist.`);
        // Proceed to refresh attempt logic below.
    }

    let accessToken = session?.accessToken; // Could be null/undefined initially

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

        // Only add Authorization header if a token is provided
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

    // --- Unified Refresh Token Logic ---
    const refreshAccessToken = async (): Promise<string | null> => {
        console.info('fetchBackendData: Attempting to refresh access token...');
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = headersList.get('host');
        const refreshEndpoint = `${protocol}://${host}/api/custom-auth/refresh`;

        try {
            const refreshResponse = await fetch(refreshEndpoint, {
                method: 'POST',
                credentials: 'include', // Important: Ensures cookies (refreshToken) are sent
                headers: {
                    'Content-Type': 'application/json',
                    ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
                }
            });

            if (!refreshResponse.ok) {
                const refreshErrorBody = await refreshResponse.json().catch(() => ({ message: 'Error during refresh parse' }));
                console.error('fetchBackendData: Token refresh failed:', refreshResponse.status, refreshErrorBody);
                return null; // Indicate refresh failure
            }

            const refreshData: { tokens?: { accessToken: string; refreshToken: string; }; message?: string; } = await refreshResponse.json();
            const newAccessToken = refreshData?.tokens?.accessToken;

            if (!newAccessToken) {
                console.error('fetchBackendData: No new access token received during refresh data.');
                return null; // Indicate refresh failure
            }

            console.info('fetchBackendData: Token refresh successful.');
            return newAccessToken;
        } catch (refreshError) {
            console.error('fetchBackendData: Network error or other unhandled error during token refresh:', refreshError);
            return null; // Indicate refresh failure
        }
    };

    let response: Response;

    // 1. If no access token exists in the session, try to refresh first.
    if (!accessToken) {
        console.warn('fetchBackendData: No access token in session. Trying to get one via refresh.');
        accessToken = await refreshAccessToken();
        if (!accessToken) {
            console.error('fetchBackendData: Failed to obtain access token via refresh. Redirecting to login.');
            redirect(`/${locale}/login`);
        }
        // If refresh was successful, proceed to make the original fetch request with the new token.
        response = await makeFetchRequest(accessToken);
    } else {
        // If an access token already exists, try the original request first.
        response = await makeFetchRequest(accessToken);
    }


    // 2. If the initial request failed with 401/403 and the message indicates expiration, attempt refresh again.
    // This handles cases where the access token *was* present but is now expired.
    if (response.status === 401 || response.status === 403) {
        console.log("fetchBackendData: Received 401/403. About to attempt refreshing if token is expired.");
        let errorResponse: BackendHttpResponse<any> | null = null;
        try {
            errorResponse = await response.json();
        } catch (e) {
            console.error("fetchBackendData: Failed to parse error response JSON on 401/403.", e);
        }

        const isAccessTokenExpired = errorResponse?.message?.includes("Access token has expired");

        if (isAccessTokenExpired) {
            console.warn(`fetchBackendData: Access token expired. Retrying refresh...`);
            accessToken = await refreshAccessToken(); // Call the unified refresh function
            if (!accessToken) {
                console.error('fetchBackendData: Failed to re-obtain access token via refresh after expiration. Redirecting to login.');
                redirect(`/${locale}/login`);
            }
            // Retry original request with new token
            response = await makeFetchRequest(accessToken);
        } else {
            // It's a 401/403 but NOT due to token expiration (e.g., invalid token, insufficient permissions)
            const finalErrorBody: ErrorResponse = errorResponse || (await response.json().catch(() => ({ message: 'Error parsing response' })));
            console.error(`fetchBackendData: Final fetch error : ${response.status}`, finalErrorBody.error || finalErrorBody.message);
            redirect(`/${locale}/login`);
        }
    }

    // 3. After all potential refresh attempts, check the response's final status.
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Error parsing response' }));
        console.error(`fetchBackendData: Final fetch error after all attempts: ${response.status}`, errorBody);
        redirect(`/${locale}/login`); // Ensure we always redirect to login on unhandled errors
    }

    const backendResponse: BackendHttpResponse<T> = await response.json();

    if (backendResponse.statusCode === 200 && backendResponse.data !== undefined && backendResponse.data !== null) {
        return backendResponse.data;
    } else {
        console.warn(`fetchBackendData: Backend responded but data/status invalid`, backendResponse);
        // If the backend indicates a non-200 status code but still sends a structured response
        // or if data is null/undefined when expected, consider it a failure.
        redirect(`/${locale}/login`); // Or return null, depending on your error handling philosophy
    }
}