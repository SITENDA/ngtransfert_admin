// src/app/api/kaasitoma/transferRequests/getTransferRequestsForClient/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function GET(request: NextRequest) {
    // Check if the backend API base URL is configured.
    if (!BACKEND_API_BASE_URL) {
        console.error('Proxy API (getTransferRequestsForClient): BACKEND_API_BASE_URL environment variable is not defined.');
        return NextResponse.json({ message: 'Server configuration error: Backend URL is missing.' }, { status: 500 });
    }

    try {
        console.log('Proxy API (getTransferRequestsForClient): Received GET request.');

        // Extract Authorization and Cookie headers from the incoming Next.js request.
        // These headers are crucial for forwarding authentication information to the backend.
        const authorizationHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');

        // Construct the URL to the Spring Boot backend endpoint.
        // Following the pattern for '/receiverAccounts/getAllReceiverAccounts',
        // we are *not* including a 'clientId' as a query parameter here.
        // The assumption is that your backend's `/transferRequests/getTransferRequestsForClient`
        // endpoint will derive the 'clientId' from the authenticated user's security context,
        // rather than expecting it as a URL query parameter.
        const backendTargetUrl = `${BACKEND_API_BASE_URL}/kaasitoma/transferRequests/getTransferRequestsForClient`;
        console.log(`Proxy API (getAllTransferRequests): Forwarding request to Spring Boot backend at: ${backendTargetUrl}`);

        // Make the fetch request to the backend.
        const backendResponse = await fetch(backendTargetUrl, {
            method: 'GET',
            headers: {
                // Conditionally add Authorization header if it exists.
                ...(authorizationHeader && { 'Authorization': authorizationHeader }),
                // Conditionally add Cookie header if it exists.
                ...(cookieHeader && { 'Cookie': cookieHeader }),
                'Content-Type': 'application/json', // Indicate JSON content type for the request body
            },
            // Prevent caching to ensure fresh data for each request.
            cache: 'no-store'
        });

        console.log(`Proxy API (getAllTransferRequests): Backend responded with status: ${backendResponse.status}`);

        const responseBodyText = await backendResponse.text();

        // Handle non-OK responses from the backend.
        if (!backendResponse.ok) {
            console.error(`Proxy API (getAllTransferRequests): Error from backend: ${backendResponse.status} ${backendResponse.statusText} - ${responseBodyText}`);
            try {
                // Attempt to parse the error response as JSON.
                console.log("responseBodyText in getTransferRequestsForClient/route.ts (non-OK responses from the backend): ", responseBodyText);
                const errorJson = JSON.parse(responseBodyText);
                return NextResponse.json(errorJson, { status: backendResponse.status });
            } catch {
                // If parsing fails, return the response as plain text.
                return new NextResponse(responseBodyText, {
                    status: backendResponse.status,
                    headers: { 'Content-Type': 'text/plain' },
                });
            }
        }

        // Handle successful responses from the backend.
        try {
            if (!responseBodyText || responseBodyText.trim() === "") {
                console.warn('Proxy API: Backend returned 200 OK with empty body. Returning empty object.');
                return NextResponse.json({}, { status: 200 });
            }

            const responseData = JSON.parse(responseBodyText);
            console.log("Proxy API: Parsed backend JSON response:", responseData);
            return NextResponse.json(responseData, { status: backendResponse.status });

        } catch (jsonParseError) {
            console.error('Proxy API (getTransferRequestsForClient): Failed to parse backend response as JSON despite OK status:', jsonParseError);
            console.error('Proxy API (getTransferRequestsForClient): Offending response text:', responseBodyText);
            return NextResponse.json(
                { message: 'Backend returned success but with an unexpected response format.' },
                { status: 500 }
            );
        }

    } catch (error) {
        // Catch and log any unhandled errors during the fetch process.
        console.error('Proxy API (getTransferRequestsForClient): Unhandled error during fetch:', error);
        return NextResponse.json({ message: 'An unexpected internal server error occurred.' }, { status: 500 });
    }
}
