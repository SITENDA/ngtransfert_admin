// src/lib/backend-api-client.ts
import { headers } from 'next/headers';
import {BackendHttpResponse, ErrorBody, ErrorResponse} from "../../types/BackendHttpResponse";
import getSession from "@/lib/getSession";
import {RefreshApiResponse} from "../../types/RefreshApiResponse";
import {FetchBackendResult} from "../../types/fetchBackendResult";
import {User} from "next-auth";
import {JWT} from "next-auth/jwt";

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

    console.log("")

    const tokenObject: JWT = session?.accessToken;

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

    const refreshAccessToken = async (): Promise<{
        accessToken: string;
        user: User;
    } | null> => {
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        const host = headersList.get("host");
        const currentHost = host || "localhost:3000";
        const refreshEndpoint = `${protocol}://${currentHost}/api/auth/refresh`;

        try {
            const refreshResponse = await fetch(refreshEndpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
                },
            });

            if (!refreshResponse.ok) {
                const errorBody: ErrorBody = await refreshResponse
                    .json()
                    .catch(() => ({ message: "Error parsing refresh response" }));
                console.error("Refresh failed:", errorBody);
                return null;
            }

            const refreshData: RefreshApiResponse = await refreshResponse.json();
            const newToken = refreshData.tokens?.data?.token;
            const newUser = refreshData.tokens?.data?.user;

            if (!newToken || !newUser) {
                return null;
            }

            return {
                accessToken: newToken,
                user: newUser,
            };
        } catch (error) {
            console.error("Token refresh error:", error);
            return null;
        }
    };

    let response: Response;



    // Step 1: If no token, try to refresh
    if (tokenObject.isExpired) {
        console.log("Token was found expired inside fetchBackendData 109");
        const refreshed = await refreshAccessToken();

        if (!refreshed) {
            return null; // Return null so caller can trigger logout
        }

        // tokenObject.accessToken = refreshed.accessToken;
    }

    // Step 2: Make the request
    response = await makeFetchRequest(tokenObject.accessToken);

    // Step 3: Retry on 401/403 if token expired
    if ([401, 403].includes(response.status)) {
        let errorData: ErrorResponse | undefined;

        try {
            errorData = await response.json();
        } catch {
            console.warn("Unable to parse error JSON");
        }

        const isExpired = errorData?.error?.includes("expired") ?? false;

        if (isExpired) {
            console.log("Token was found expired inside fetchBackendData 134");
            const refreshed = await refreshAccessToken();

            if (!refreshed) {
                return null;
            }
            response = await makeFetchRequest(tokenObject.accessToken);
        } else {
            return null;
        }
    }

    // Final check for non-OK responses
    if (!response.ok) {
        return null;
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
        console.error("Empty response body from backend at", fullUrl);
        return null;
    }

    let backendResponse: BackendHttpResponse<T>;

    try {
        backendResponse = JSON.parse(text);
    } catch (e) {
        console.error("Invalid JSON from backend at", fullUrl, "Response:", text);
        return null;
    }


    if (backendResponse.statusCode === 200 && backendResponse.data != null) {
        return backendResponse.data;
    }

    return null;
}