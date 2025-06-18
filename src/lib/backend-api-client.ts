// src/lib/backend-api-client.ts
// This utility is designed to be used in Next.js Server Components
// as it relies on server-only functions like `getSession`, `redirect`, `getLocale`, and `headers`.

import getSession from "@/lib/getSession"; // Assuming getSession is available and works as expected
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import {BackendHttpResponse} from "../../types/BackendHttpResponse";

/**
 * Fetches data from the backend API with authentication headers and robust error handling.
 * This function should only be called from Next.js Server Components.
 *
 * @template T The expected type of the 'data' payload within the BackendHttpResponse.
 * @param {string} endpoint The specific API endpoint relative to the backend base URL (e.g., "/kaasitoma/countries/getPriorityCountries").
 * @param {string} method The HTTP method (e.g., 'GET', 'POST'). Defaults to 'GET'.
 * @param {any} [body] The request body for POST/PUT/PATCH requests. Will be stringified to JSON.
 * @param {number} [revalidateSeconds=3600] The revalidation time in seconds for Next.js cache. Defaults to 1 hour.
 * @returns {Promise<T | null>} A Promise that resolves to the 'data' payload if successful, or null if an error occurs (including authentication issues or malformed responses).
 */
export async function fetchBackendData<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    revalidateSeconds: number = 60 * 60 // Default to 1 hour (3600 seconds)
): Promise<T | null> {
    const session = await getSession();
    const locale = await getLocale(); // Get current locale for locale-aware redirects

    // Comprehensive authentication check
    if (!session || !session.user || !session.user.userId || !session.accessToken) {
        console.warn(`fetchBackendData (from ${endpoint}): User not authenticated or missing required session data. Redirecting to /${locale}/login`);
        // Use redirect to handle unauthenticated state at the page level
        redirect(`/${locale}/login`);
        // Note: The `redirect` function throws an error, so the code below it
        // will not execute if a redirect occurs.
    }

    const accessToken = session.accessToken;
    const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';
    const fullUrl = `${backendApiBaseUrl}${endpoint}`;

    // Get incoming headers to forward cookies if necessary for session/refresh mechanisms
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');

    // Prepare fetch options
    const fetchOptions: RequestInit = {
        method: method,
        headers: {
            'Authorization': `Bearer ${accessToken}`, // Securely pass the access token
            'Content-Type': 'application/json',      // Assume JSON payload for most API calls
            ...(cookieHeader && { 'Cookie': cookieHeader }), // Forward cookies if present
        },
        next: {
            revalidate: revalidateSeconds // Configure Next.js caching behavior
        }
    };

    // Add request body for appropriate HTTP methods
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        // console.log(`fetchBackendData: Attempting to fetch from ${fullUrl} using method ${method}...`);
        const response = await fetch(fullUrl, fetchOptions);

        if (!response.ok) {
            // Attempt to parse error body for more details
            const errorBody = await response.json().catch(() => ({ message: 'Failed to parse error response body' }));
            console.error(`fetchBackendData: Backend responded with an error for ${fullUrl}: Status ${response.status} ${response.statusText}`, errorBody);

            // Redirect on specific authentication/authorization errors
            if (response.status === 401 || response.status === 403) {
                console.warn(`fetchBackendData: Authentication/Authorization issue. Redirecting to /${locale}/login`);
                redirect(`/${locale}/login`);
            }
            return null; // Return null to indicate fetch failure
        }

        const backendResponse: BackendHttpResponse<T> = await response.json();

        // Check the backend's custom status code and data presence
        if (backendResponse.statusCode === 200 && backendResponse.data !== undefined && backendResponse.data !== null) {
            // console.log(`fetchBackendData: Successfully received data from ${fullUrl}.`);
            return backendResponse.data; // Return the actual data payload
        } else {
            console.warn(`fetchBackendData: Backend response for ${fullUrl} was OK (HTTP 200), but 'data' was missing/null or custom statusCode not 200:`, backendResponse);
            return null; // Indicate successful HTTP but unsuccessful business logic response
        }
    } catch (error) {
        console.error(`fetchBackendData: Network or unexpected error during fetch from ${fullUrl}:`, error);
        return null; // Return null on network or other unexpected errors
    }
}
