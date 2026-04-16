/**
 * Represents the standardized HTTP response wrapper from your backend.
 * `T` is a generic type for the actual data payload (e.g., `BankDataPayload` for banks).
 * Corresponds to your Java `HttpResponse` class.
 */
export interface BackendHttpResponse<T> {
    timeStamp: string;
    statusCode: number;
    status: string;
    message: string;
    data: T; // This will hold the specific payload (e.g., BankDataPayload)
}

export interface ErrorResponse {
    error: string;
    statusCode: number;
}

export interface ErrorBody {
    error_message: string;
    message?:  string;
}