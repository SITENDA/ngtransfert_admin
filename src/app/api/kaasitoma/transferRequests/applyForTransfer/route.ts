// src/app/api/kaasitoma/transferRequests/applyForTransfer/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function POST(request: NextRequest) {
    // 1. Configuration Check
    if (!BACKEND_API_BASE_URL) {
        console.error('Proxy API (applyForTransfer): BACKEND_API_BASE_URL environment variable is not defined.');
        return NextResponse.json({ message: 'Server configuration error: Backend URL is missing.' }, { status: 500 });
    }

    try {
        console.log('Proxy API (applyForTransfer): Received POST request.');

        // 2. Extract Headers for Authentication Forwarding
        const authorizationHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');

        // 3. Parse Request Body
        // The incoming request body should be JSON representing RequestTransferRequestDTO
        const requestBody = await request.json();
        console.log('Proxy API (applyForTransfer): Incoming request body (first 200 chars):', JSON.stringify(requestBody).substring(0, 200));

        // 4. Construct Backend Target URL
        const backendTargetUrl = `${BACKEND_API_BASE_URL}/kaasitoma/transferRequests/createTransferRequest`;
        console.log(`Proxy API (applyForTransfer): Forwarding request to Spring Boot backend at: ${backendTargetUrl}`);

        // 5. Forward Request to Backend
        const backendResponse = await fetch(backendTargetUrl, {
            method: 'POST',
            headers: {
                // Forward Authorization and Cookie headers for backend authentication
                ...(authorizationHeader && { 'Authorization': authorizationHeader }),
                ...(cookieHeader && { 'Cookie': cookieHeader }),
                'Content-Type': 'application/json', // Crucial: tell backend we are sending JSON
            },
            body: JSON.stringify(requestBody), // Send the parsed JSON body
            cache: 'no-store' // Ensure no caching for POST requests
        });

        console.log(`Proxy API (applyForTransfer): Backend responded with status: ${backendResponse.status}`);

        const responseBodyText = await backendResponse.text();

        // 6. Handle Backend Response
        if (!backendResponse.ok) {
            console.error(`Proxy API (applyForTransfer): Error from backend: ${backendResponse.status} ${backendResponse.statusText} - ${responseBodyText}`);
            try {
                const errorJson = JSON.parse(responseBodyText);
                return NextResponse.json(errorJson, { status: backendResponse.status });
            } catch {
                return new NextResponse(responseBodyText, {
                    status: backendResponse.status,
                    headers: { 'Content-Type': 'text/plain' },
                });
            }
        }

        // Handle successful responses
        try {
            const responseData = JSON.parse(responseBodyText);
            console.log('Proxy API (applyForTransfer): Backend response data (first 200 chars):', JSON.stringify(responseData).substring(0, 200));
            return NextResponse.json(responseData, { status: backendResponse.status });
        } catch (jsonParseError) {
            console.error('Proxy API (applyForTransfer): Failed to parse backend response as JSON despite OK status:', jsonParseError);
            console.error('Proxy API (applyForTransfer): Offending response text:', responseBodyText);
            return NextResponse.json(
                { message: 'Backend returned success but with an unexpected response format.' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Proxy API (applyForTransfer): Unhandled error during POST request:', error);
        return NextResponse.json({ message: 'An unexpected internal server error occurred during transfer application.' }, { status: 500 });
    }
}
