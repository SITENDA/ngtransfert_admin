/**
 * /home/amos/docure/ngtransfert_admin/types/BackendGenericResponse.ts
 * Generic backend response structure.
 * This can be reused for various API responses.
 * @template T The type of the actual data payload.
 */
// Generic backend response structure (reusable)

export interface BackendGenericResponse<T> {
    timeStamp: string;
    statusCode: number;
    status: string; // e.g., "OK", "UNAUTHORIZED"
    message: string;
    developerMessage?: string;
    path?: string;
    requestMethod?: string;
    data?: T; // The actual payload will be of type T
}