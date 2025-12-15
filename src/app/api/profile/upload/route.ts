// app/api/profile/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: NextRequest) {
    const authorizationHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');

    if (!authorizationHeader) {
        return NextResponse.json({ error: "Unauthorized - missing authorization header" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    try {
        const backendRes = await fetch(`${BACKEND_API_BASE_URL}/kaasitoma/users/uploadProfileImage`, {
            method: "POST",
            headers: {
                Authorization: authorizationHeader,
                ...(cookieHeader && { 'Cookie': cookieHeader }), // If needed
            },
            body: formData,
        });

        const rawResponse = await backendRes.text();

        let data;
        try {
            data = JSON.parse(rawResponse);
        } catch (err) {
            console.error("Upload API: Invalid JSON from backend:", rawResponse);
            return NextResponse.json({ message: "Invalid response from backend" }, { status: 500 });
        }

        return NextResponse.json(data, { status: backendRes.status });

    } catch (err: any) {
        console.error("Upload API: Failed to reach backend:", err);
        return NextResponse.json({ message: "Failed to upload profile image." }, { status: 500 });
    }
}