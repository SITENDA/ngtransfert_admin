//  /home/amos/docure/ngtransfert_admin/src/lib/backend-api-client.ts

import getSession from "@/lib/getSession";
import { BackendHttpResponse } from "../../types/BackendHttpResponse";
import { FetchBackendResult } from "../../types/fetchBackendResult";
import { forceLogout } from "@/lib/server/forceLogout";
import { ensureValidAccessToken } from "@/lib/server/ensureValidAccessToken";
import getBackEndApiUrl from "@/lib/getBackEndApiUrl";

/**
 * Fetch backend data using BFF-controlled session.
 * NO access token is read in JS.
 * HttpOnly cookie is forwarded automatically.
 */
export async function fetchBackendData<T>(
    endpoint: string,
    method: string = "GET",
    body?: unknown,
    revalidateSeconds: number = 0
): Promise<FetchBackendResult<T>> {

    /* -------------------------------------------------
     * 1️⃣ Load Redis-backed BFF session
     * ------------------------------------------------- */
    const session = await getSession();
    if (!session) {
        return null;
    }

    /* -------------------------------------------------
     * 2️⃣ Enforce BFF session rules
     * (idle timeout, sliding window, rotation)
     * ------------------------------------------------- */
    const ok = await ensureValidAccessToken(session);
    if (!ok) {
        await forceLogout();
        return null;
    }

    /* -------------------------------------------------
     * 3️⃣ Call backend (COOKIE-BASED AUTH)
     * ------------------------------------------------- */
    const backendApiBaseUrl = getBackEndApiUrl();

    let response: Response;

    try {
        response = await fetch(`${backendApiBaseUrl}${endpoint}`, {
            method,
            credentials: "include", // 🔥 THIS IS THE AUTH
            headers: {
                "Content-Type": "application/json",
            },
            body:
                body && ["POST", "PUT", "PATCH"].includes(method)
                    ? JSON.stringify(body)
                    : undefined,
            next: { revalidate: revalidateSeconds },
        });
    } catch (err) {
        console.error("❌ Backend fetch failed:", err);
        await forceLogout();
        return null;
    }

    /* -------------------------------------------------
     * 4️⃣ Hard auth failure → force logout
     * ------------------------------------------------- */
    if (response.status === 401 || response.status === 403) {
        await forceLogout();
        return null;
    }

    /* -------------------------------------------------
     * 5️⃣ Safe response parsing
     * ------------------------------------------------- */
    const text = await response.text();
    if (!text) return null;

    let backendResponse: BackendHttpResponse<T>;
    try {
        backendResponse = JSON.parse(text);
    } catch {
        console.error("❌ Backend returned non-JSON:", text);
        return null;
    }

    return backendResponse.statusCode === 200
        ? backendResponse.data
        : null;
}
