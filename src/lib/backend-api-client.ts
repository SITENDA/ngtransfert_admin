//  /home/amos/docure/ngtransfert_admin/src/lib/backend-api-client.ts

import {cookies, headers} from "next/headers";
import getSession from "@/lib/getSession";
import { BackendHttpResponse } from "../../types/BackendHttpResponse";
import { FetchBackendResult } from "../../types/fetchBackendResult";
import { forceLogout } from "@/lib/server/forceLogout";
import {Session} from "../../types/session";

/**
 * Fetch backend data using BFF session
 */
export async function fetchBackendData<T>(
    endpoint: string,
    method: string = "GET",
    body?: unknown,
    revalidateSeconds: number = 3600
): Promise<FetchBackendResult<T>> {
    const session = await getSession();

    if (!session) {
        return null;
    }

    const backendApiBaseUrl =
        process.env.BACKEND_API_BASE_URL || "http://localhost:8080";
    const fullUrl = `${backendApiBaseUrl}${endpoint}`;

    const headersList = await headers();
    const cookieHeaderResult = await cookies();
    const cookieHeader = cookieHeaderResult
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    /**
     * Performs backend request with provided token
     */
    const doFetch = async (token: string): Promise<Response> => {
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
            next: { revalidate: revalidateSeconds },
        };

        if (body && ["POST", "PUT", "PATCH"].includes(method)) {
            options.body = JSON.stringify(body);
        }

        return fetch(fullUrl, options);
    };

    /**
     * Refresh token via BFF
     */

    const refreshSession = async (): Promise<boolean> => {
        const protocol =
            process.env.NODE_ENV === "development" ? "http" : "https";
        const host = headersList.get("host") || "localhost:3000";

        const refreshRes = await fetch(
            `${protocol}://${host}/api/auth/refresh`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
                },
            }
        );

        if (!refreshRes.ok) {
            await forceLogout();
            return false;
        }

        return true;
    };


    // ✅ Step 1: Ensure token validity
    let activeSession : Session | null = session;

    if (Date.now() >= session.accessTokenExpiresAt) {
        const ok = await refreshSession();
        if (!ok) return null;

        // 🔄 Reload session from Redis
        activeSession = await getSession();
        if (!activeSession) return null;
    }

    // ✅ Step 2: Perform request
    let response = await doFetch(activeSession.accessToken);

    // ✅ Step 3: Retry on auth failure
    if ([401, 403].includes(response.status)) {
        const refreshed = await refreshSession();
        if (!refreshed) return null;

        const ok = await refreshSession();
        if (!ok) return null;

        // 🔄 Reload updated session from Redis
        activeSession = await getSession();
        if (!activeSession) return null;

        response = await doFetch(activeSession.accessToken);

        if (!response.ok) return null;
    }

    // ✅ Step 4: Parse response
    const text = await response.text();
    if (!text) return null;

    let backendResponse: BackendHttpResponse<T>;
    try {
        backendResponse = JSON.parse(text);
    } catch {
        return null;
    }

    if (backendResponse.statusCode === 200) {
        return backendResponse.data;
    }

    return null;
}
