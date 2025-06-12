// app/api/kaasitoma/receiverAccounts/createReceiverAccount/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Retrieve your backend base URL from environment variables.
// Ensure BACKEND_API_BASE_URL is defined in your .env.local for development
// and in your deployment environment settings.
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function POST(request: NextRequest) {
    // Basic check to ensure the backend URL is configured.
    if (!BACKEND_API_BASE_URL) {
        console.error('BACKEND_API_BASE_URL environment variable is not defined.');
        return NextResponse.json({ message: 'Server configuration error: Backend URL is missing.' }, { status: 500 });
    }

    try {
        console.log('Proxy API: Received POST request for receiver account creation.');

        // Extract Authorization and Cookie headers from the incoming Next.js request.
        // These will be forwarded to your Spring Boot backend for authentication.
        const authorizationHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');

        // Crucially, get the FormData directly from the Next.js request body.
        // This is how Next.js handles 'multipart/form-data' payloads.
        const formData = await request.formData();

        console.log('Proxy API: Forwarding request to Spring Boot backend...');

        // Make the fetch call to your Spring Boot backend.
        const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/kaasitoma/receiverAccounts/createReceiverAccount`, {
            method: 'POST',
            // When 'body' is a FormData object, `fetch` automatically sets the
            // 'Content-Type' header to 'multipart/form-data' with the correct boundary.
            body: formData,
            headers: {
                // Manually propagate the Authorization and Cookie headers.
                ...(authorizationHeader && { 'Authorization': authorizationHeader }),
                ...(cookieHeader && { 'Cookie': cookieHeader }),
            },
            // Disable caching for POST requests to ensure each submission is processed live.
            cache: 'no-store'
        });

        console.log(`Proxy API: Backend responded with status: ${backendResponse.status}`);

        // If the backend's response is not successful (e.g., 4xx or 5xx status codes),
        // read its error body and return it to the client with the appropriate status.
        if (!backendResponse.ok) {
            const errorBody = await backendResponse.text();
            console.error(`Proxy API: Error from backend: ${backendResponse.status} ${backendResponse.statusText} - ${errorBody}`);

            // Attempt to parse the error body as JSON. If it fails, return as plain text.
            try {
                const errorJson = JSON.parse(errorBody);
                return NextResponse.json(errorJson, { status: backendResponse.status });
            } catch {
                return new NextResponse(errorBody, {
                    status: backendResponse.status,
                    headers: { 'Content-Type': 'text/plain' },
                });
            }
        }

        // If the backend request was successful, parse its JSON response and return it.
        const responseData = await backendResponse.json();
        console.log('Proxy API: Backend response data:', responseData);

        return NextResponse.json(responseData, { status: backendResponse.status });

    } catch (error) {
        console.error('Proxy API: Unhandled error during receiver account creation process:', error);
        // Return a generic internal server error for any unexpected exceptions.
        return NextResponse.json({ message: 'An unexpected internal server error occurred.' }, { status: 500 });
    }
}