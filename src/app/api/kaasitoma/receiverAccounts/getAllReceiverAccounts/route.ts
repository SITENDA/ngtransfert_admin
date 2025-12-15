// src/app/api/kaasitoma/receiverAccounts/getAllReceiverAccounts/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export async function GET(request: NextRequest) {
    if (!BACKEND_API_BASE_URL) {
        console.error('Proxy API (getAllReceiverAccounts): BACKEND_API_BASE_URL environment variable is not defined.');
        return NextResponse.json({ message: 'Server configuration error: Backend URL is missing.' }, { status: 500 });
    }

    try {
        console.log('Proxy API (getAllReceiverAccounts): Received GET request.');

        // Extract Authorization and Cookie headers from the incoming Next.js request.
        const authorizationHeader = request.headers.get('authorization');
        const cookieHeader = request.headers.get('cookie');

        // Extract clientId from the URL's query parameters
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');

        // --- ADDED LOGGING HERE ---
        console.log('Proxy API (getAllReceiverAccounts): Incoming Authorization Header:', authorizationHeader ? authorizationHeader.substring(0, 10) + '...' : 'N/A (missing)');
        console.log('Proxy API (getAllReceiverAccounts): Incoming Cookie Header:', cookieHeader ? cookieHeader.substring(0, 10) + '...' : 'N/A (missing)');
        console.log('Proxy API (getAllReceiverAccounts): Received clientId query parameter:', clientId);
        // --- END ADDED LOGGING ---

        // Construct the URL to the Spring Boot backend endpoint, including the clientId.
        // It's crucial that the backend endpoint for fetching is now /receiverAccounts/getAllReceiverAccounts
        // and expects clientId from the authenticated context, not a query param.
        // HOWEVER, if your backend *also* needs clientId from query, you'd add it here.
        // Given our updated Spring Boot controller gets clientId from auth context,
        // we revert to simpler URL here:
        const backendTargetUrl = `${BACKEND_API_BASE_URL}/kaasitoma/receiverAccounts/getAllReceiverAccounts`;
        console.log(`Proxy API (getAllReceiverAccounts): Forwarding request to Spring Boot backend at: ${backendTargetUrl}`);

        const backendResponse = await fetch(backendTargetUrl, {
            method: 'GET',
            headers: {
                ...(authorizationHeader && { 'Authorization': authorizationHeader }),
                ...(cookieHeader && { 'Cookie': cookieHeader }),
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        console.log(`Proxy API (getAllReceiverAccounts): Backend responded with status: ${backendResponse.status}`);

        const responseBodyText = await backendResponse.text();

        if (!backendResponse.ok) {
            console.error(`Proxy API (getAllReceiverAccounts): Error from backend: ${backendResponse.status} ${backendResponse.statusText} - ${responseBodyText}`);
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

        try {
            const responseData = JSON.parse(responseBodyText);
            // console.log('Proxy API (getAllReceiverAccounts): Backend response data (first 200 chars):', JSON.stringify(responseData).substring(0, 200));
            return NextResponse.json(responseData, { status: backendResponse.status });
        } catch (jsonParseError) {
            console.error('Proxy API (getAllReceiverAccounts): Failed to parse backend response as JSON despite OK status:', jsonParseError);
            console.error('Proxy API (getAllReceiverAccounts): Offending response text:', responseBodyText);
            return NextResponse.json(
                { message: 'Backend returned success but with an unexpected response format.' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Proxy API (getAllReceiverAccounts): Unhandled error during fetch:', error);
        return NextResponse.json({ message: 'An unexpected internal server error occurred.' }, { status: 500 });
    }
}
