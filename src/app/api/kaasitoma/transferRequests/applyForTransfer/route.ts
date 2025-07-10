// src/app/api/kaasitoma/transferRequests/applyForTransfer/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function POST(request: NextRequest) {
    console.log('DEBUG: Proxy API (/api/kaasitoma/transferRequests/applyForTransfer): Request received.');

    // 1. Configuration Check
    if (!BACKEND_API_BASE_URL) {
        console.error('ERROR: Proxy API (applyForTransfer): BACKEND_API_BASE_URL environment variable is not defined. Please set it in your .env file.');
        return NextResponse.json({ message: 'Server configuration error: Backend URL is missing.' }, { status: 500 });
    }

    try {
        // 2. Extract Headers for Authentication Forwarding
        const authorizationHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');
        console.log('DEBUG: Proxy API (applyForTransfer): Auth Header:', authorizationHeader ? 'Present' : 'Missing');
        console.log('DEBUG: Proxy API (applyForTransfer): Cookie Header (partial):', cookieHeader ? cookieHeader.substring(0, 50) + '...' : 'Missing');

        // 3. Parse Request Body
        let requestBody;
        try {
            requestBody = await request.json();
            console.log('DEBUG: Proxy API (applyForTransfer): Incoming request body (first 200 chars):', JSON.stringify(requestBody).substring(0, 200));
        } catch (jsonError) {
            console.error('ERROR: Proxy API (applyForTransfer): Failed to parse request body as JSON:', jsonError);
            return NextResponse.json({ message: 'Invalid request body: Must be valid JSON.' }, { status: 400 });
        }


        // 4. Construct Backend Target URL
        const backendTargetUrl = `${BACKEND_API_BASE_URL}/kaasitoma/transferRequests/createTransferRequest`;
        console.log(`DEBUG: Proxy API (applyForTransfer): Forwarding request to Spring Boot backend at: ${backendTargetUrl}`);

        // 5. Forward Request to Backend
        let backendResponse;
        try {
            backendResponse = await fetch(backendTargetUrl, {
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
            console.log(`DEBUG: Proxy API (applyForTransfer): Backend responded with status: ${backendResponse.status}`);
        } catch (fetchError: any) {
            console.error('CRITICAL ERROR: Proxy API (applyForTransfer): Network error or unhandled fetch exception when calling backend:', fetchError);
            return NextResponse.json({ message: `Network error or backend unreachable: ${fetchError.message || 'Unknown error'}` }, { status: 500 });
        }


        let responseBodyText = '';
        try {
            responseBodyText = await backendResponse.text();
        } catch (readError) {
            console.error('ERROR: Proxy API (applyForTransfer): Failed to read backend response text:', readError);
            return NextResponse.json({ message: 'Failed to read response from backend.' }, { status: 500 });
        }


        // 6. Handle Backend Response
        if (!backendResponse.ok) {
            console.error(`ERROR: Proxy API (applyForTransfer): Error from backend: ${backendResponse.status} ${backendResponse.statusText}. Response text: ${responseBodyText}`);
            try {
                const errorJson = JSON.parse(responseBodyText);
                return NextResponse.json(errorJson, { status: backendResponse.status });
            } catch (parseError) {
                console.error('ERROR: Proxy API (applyForTransfer): Failed to parse backend error response as JSON:', parseError);
                return new NextResponse(responseBodyText, {
                    status: backendResponse.status,
                    headers: { 'Content-Type': 'text/plain' },
                });
            }
        }

        // Handle successful responses
        try {
            const responseData = JSON.parse(responseBodyText);
            // console.log('DEBUG: Proxy API (applyForTransfer): Backend response data (first 200 chars):', JSON.stringify(responseData).substring(0, 200));
            return NextResponse.json(responseData, { status: backendResponse.status });
        } catch (jsonParseError) {
            console.error('ERROR: Proxy API (applyForTransfer): Failed to parse backend response as JSON despite OK status:', jsonParseError);
            console.error('ERROR: Proxy API (applyForTransfer): Offending response text:', responseBodyText);
            return NextResponse.json(
                { message: 'Backend returned success but with an unexpected response format.' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('CRITICAL ERROR: Proxy API (applyForTransfer): Unhandled error during POST request processing:', error);
        return NextResponse.json({ message: 'An unexpected internal server error occurred during transfer application.' }, { status: 500 });
    }
}
