// src/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/page.tsx
// This file is a Server Component by default in the App Router.
// No "use client" here!

import AddReceiverAccountForm from "./AddReceiverAccountForm";
import PublicWrapper from "@/components/PublicWrapper"; // This should be a Client Component
import { BackendHttpResponse, Bank, BankDataPayload } from "../../../../../../types/bank";
import { headers } from 'next/headers'; // Import headers for Server Components
// import { redirect } from 'next/navigation'; // Uncomment if you want to redirect to login on auth failure

type Props = {
    // If you have dynamic routes like [countryName] in the URL,
    // you would access it via `params`:
    // params: { countryName: string; };
};

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';

async function AddReceiverAccount({}: Props) {
    let banks: Bank[] = [];
    const countryName = "China"; // Example: can be made dynamic

    try {
        const headersList = await headers(); // Get headers from the incoming request to the Next.js server
        const cookieHeader = headersList.get('cookie'); // Get the raw 'Cookie' header string

        let authToken: string | null = null;
        // Parse the cookie string to find your refresh token
        // Assuming your refresh token is stored in an HttpOnly cookie named 'refreshToken'
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').map((cookie: string) => cookie.trim());
            const refreshTokenCookie = cookies.find((cookie: string) => cookie.startsWith('refreshToken='));
            if (refreshTokenCookie) {
                authToken = refreshTokenCookie.split('=')[1]; // Extract the token value
            }
        }

        if (!authToken) {
            console.warn("No authentication token found in cookies for server-side fetch. User might not be logged in or token expired.");
            // If authentication is mandatory for this page, you might redirect the user:
            // redirect('/login'); // Requires `import { redirect } from 'next/navigation';`
            // For now, we'll return an empty array and let the UI handle the "not authenticated" state.
            return (
                <PublicWrapper>
                    <div className="
                        w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                        bg-background/80 backdrop-blur-sm border border-border
                        dark:bg-gray-800/80 dark:border-gray-700
                    ">
                        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Add Receiver Account</h2>
                        <p className="text-red-500 text-center mb-4">Please log in to view and add receiver accounts.</p>
                        {/* Pass an empty array if not authenticated, as the form expects `initialBanks` */}
                        <AddReceiverAccountForm initialBanks={banks} />
                    </div>
                </PublicWrapper>
            );
        }

        // Make the authenticated fetch request to your backend
        const response = await fetch(`${BACKEND_API_BASE_URL}/kaasitoma/banks/getAllBanksByCountryName?countryName=${countryName}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`, // Attach the token to the Authorization header
                'Content-Type': 'application/json', // Essential for JSON APIs
            },
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        // console.log("Response is : ", response); // Log the full response object

        if (!response.ok) {
            console.error(`Failed to fetch banks: ${response.status} ${response.statusText}`);
            // If the status is 401 (Unauthorized) or 403 (Forbidden), specifically log it
            if (response.status === 401 || response.status === 403) {
                console.error("Server-side bank fetch failed: Authentication or Authorization issue.");
                // You might trigger a client-side re-authentication or redirect here
                // Note: Redirects from Server Components are handled differently than client-side redirects.
            }
            banks = [];
        } else {
            const backendResponse: BackendHttpResponse<BankDataPayload> = await response.json();

            // Check if data and banks array exist and statusCode is 200
            if (backendResponse.statusCode === 200 && backendResponse.data && backendResponse.data.banks) {
                banks = backendResponse.data.banks;
                // console.log("Banks fetched on server:", banks);
            } else {
                console.warn("Backend response was OK, but 'data' or 'banks' array was missing/empty:", backendResponse);
                banks = []; // Ensure banks is an empty array if data structure is unexpected
            }
        }
    } catch (error) {
        console.error("Error fetching banks:", error);
        banks = []; // Handle network errors or JSON parsing errors
    }

    return (
        <PublicWrapper>
            <div className="
                w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Add Receiver Account</h2>
                {/* Pass the fetched banks data to the client component */}
                <AddReceiverAccountForm initialBanks={banks}/>
            </div>
        </PublicWrapper>
    );
}

export default AddReceiverAccount;