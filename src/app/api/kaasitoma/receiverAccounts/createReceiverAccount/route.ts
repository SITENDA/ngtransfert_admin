// app/api/kaasitoma/receiverAccounts/createReceiverAccount/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function POST(request: NextRequest) {
    if (!BACKEND_API_BASE_URL) {
        console.error('BACKEND_API_BASE_URL environment variable is not defined.');
        return NextResponse.json({ message: 'Server configuration error: Backend URL is missing.' }, { status: 500 });
    }

    try {
        console.log('Proxy API: Received POST request for receiver account creation.');

        const authorizationHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');

        // --- ADDED LOGGING HERE ---
        console.log('Proxy API: Incoming Authorization Header:', authorizationHeader ? authorizationHeader : 'N/A (missing)');
        console.log('Proxy API: Incoming Cookie Header:', cookieHeader ? cookieHeader : 'N/A (missing)');
        // --- END ADDED LOGGING ---

        const formData = await request.formData();

        // Optional: Log a snippet of form data (be careful with sensitive info)
        // const formEntries = Array.from(formData.entries());
        // console.log('Proxy API: Form Data Keys:', formEntries.map(([key, value]) => key));


        console.log('Proxy API: Forwarding request to Spring Boot backend...');

        const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/kaasitoma/receiverAccounts/createReceiverAccount`, {
            method: 'POST',
            body: formData,
            headers: {
                // Manually propagate the Authorization and Cookie headers.
                ...(authorizationHeader && { 'Authorization': authorizationHeader }),
                ...(cookieHeader && { 'Cookie': cookieHeader }),
            },
            cache: 'no-store'
        });

        console.log(`Proxy API: Backend responded with status: ${backendResponse.status}`);

        if (!backendResponse.ok) {
            const errorBody = await backendResponse.text();
            console.error(`Proxy API: Error from backend: ${backendResponse.status} ${backendResponse.statusText} - ${errorBody}`);

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

        console.log("Backend response : ", backendResponse); // This will log the Response object, not its body.
        // If you want the body, parse it first.

        const responseData = await backendResponse.json();
        console.log('Proxy API: Backend response data:', responseData);

        return NextResponse.json(responseData, { status: backendResponse.status });

    } catch (error) {
        console.error('Proxy API: Unhandled error during receiver account creation process:', error);
        return NextResponse.json({ message: 'An unexpected internal server error occurred.' }, { status: 500 });
    }
}