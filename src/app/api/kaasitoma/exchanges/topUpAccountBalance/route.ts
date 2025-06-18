// app/api/kaasitoma/exchanges/topUpAccountBalance/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function POST(request: NextRequest) {
    if (!BACKEND_API_BASE_URL) {
        console.error('BACKEND_API_BASE_URL environment variable is not defined.');
        return NextResponse.json({ message: 'Server configuration error: Backend URL is missing.' }, { status: 500 });
    }

    try {
        console.log('Proxy API: Received POST request for topUpAccountBalance.');

        const authorizationHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');

        const formData = await request.formData();

        console.log('Proxy API: Forwarding details request to Spring Boot backend...');

        const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/kaasitoma/exchanges/topUpAccountBalance`, {
            method: 'POST',
            body: formData,
            headers: {
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

        const responseData = await backendResponse.json();
        // console.log('Proxy API: Backend response data:', responseData);

        return NextResponse.json(responseData, { status: backendResponse.status });

    } catch (error) {
        console.error('Proxy API: Unhandled error during details process:', error);
        return NextResponse.json({ message: 'An unexpected internal server error occurred.' }, { status: 500 });
    }
}
