"use server";

import getSession from "@/lib/getSession";

export async function uploadProfileImageAction(formData: FormData) {
    try {
        const session = await getSession();

        if (!session || !session.accessToken) {
            console.error("uploadProfileImageAction: Missing or invalid session.");
            return { success: false, message: "Authentication required to upload image." };
        }

        const accessToken = session.accessToken;
        const proxyApiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/profile/upload`;

        const response = await fetch(proxyApiUrl, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // Content-Type is automatically set by fetch when sending FormData
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`uploadProfileImageAction: Backend error ${response.status}`, responseData);
            return {
                success: false,
                message: responseData.message || "Profile image upload failed."
            };
        }

        return {
            success: true,
            message: "Profile image uploaded successfully!",
            data: responseData,
            updatedUser: responseData.data?.user,
        };

    } catch (error) {
        console.error("uploadProfileImageAction: Unexpected error:", error);
        return {
            success: false,
            message: "An unexpected error occurred during profile image upload."
        };
    }
}
