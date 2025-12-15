// 1. Updated Server Action: src/app/actions/userActions.ts
"use server";

import getSession from "@/lib/getSession";
import {JWT} from "next-auth/jwt";

export async function updateUserProfileAction(profileData: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
}) {
    try {
        const session = await getSession();

        if (!session || !session.accessToken) {
            console.error("Authentication failed. Session or Access Token missing.");
            return { success: false, message: "Authentication required to update profile." };
        }

        const tokenObject: JWT = session.accessToken;
        const accessToken = tokenObject.accessToken;
        const proxyApiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/profile/updateProfile`;

        const response = await fetch(proxyApiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`API proxy error: ${response.status}`, data);
            return { success: false, message: data.message || "Failed to update profile." };
        }

        return { success: true, message: "Profile updated successfully", data };
    } catch (error) {
        console.error("Unexpected error during profile update:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}