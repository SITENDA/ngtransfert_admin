// app/[locale]/dashboard/page.tsx
// "use client"; // This directive marks the component as a Client Component
// Removed all Next.js and next-intl specific imports that cause compilation errors
// In a full Next.js environment, you would keep:
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import getSession from "@/lib/getSession";
import {ClickableRow} from "@/components/ClickableRow";

export const metadata = {
    title: "Dashboard",
};

export default async function KaasitomaDashboardPage() {
    // --- Removed Next.js server-side logic for compilation in this environment ---
    const session = await getSession();
    const user = session?.user;
    const locale = await getLocale();

    // --- Removed redirect logic for compilation in this environment ---
    if (!user) {
        redirect(`/${locale}/login`);
        return null;
    }

    // Placeholder data for counts - replace with actual data fetching logic in a full app
    const receiverAccountsCount = 5;
    const sendingRecordsCount = 12;
    const transferRequestsCount = 3;
    const settledTransfersCount = 9;

    return (
        // Replaced PublicWrapper with a simple div for basic centering and background
        <div className="min-h-screen  flex items-center justify-center p-4 font-sans">
            {/* Main card container */}
            <Card className="w-full flex-grow mx-auto my-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col h-full max-w-screen-lg rounded-xl shadow-lg">
                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">Client Dashboard</CardTitle>
                    {/* Button for adding receiver account. Using onClick for demonstration. */}

                    <Link href={'/kaasitoma/add-receiver-account'} passHref>
                        <Button variant="outline"
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Add Receiver Account
                        </Button>
                    </Link>
                </CardHeader>

                {/* CardContent to take available space and display dashboard items */}
                <CardContent className="flex-grow p-6 space-y-8">
                    {/* Welcome Message */}
                    <div className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                        Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.fullName}</span>!
                    </div>

                    {/* Receiver Accounts Section */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Accounts</h3>
                        <div className="space-y-3">
                            {/* Clickable row for Receiver Accounts */}
                            <ClickableRow href="/kaasitoma/receiver-accounts" count={receiverAccountsCount}>
                                Receiver Accounts
                            </ClickableRow>
                            {/* You can add more account-related rows here if needed */}
                        </div>
                    </section>

                    {/* Sending Records Section */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Sending Records</h3>
                        <div className="space-y-3">
                            {/* Clickable row for Sending Records */}
                            <ClickableRow href={`/${locale}/sending-records`} count={sendingRecordsCount} className="hover:bg-green-50 dark:hover:bg-green-900">
                                All Sending Records
                            </ClickableRow>

                            {/* Clickable row for Transfer Requests */}
                            <ClickableRow href={`/${locale}/transfer-requests`} count={transferRequestsCount} className="hover:bg-yellow-50 dark:hover:bg-yellow-900">
                                Transfer Requests
                            </ClickableRow>

                            {/* Clickable row for Settled Transfers */}
                            <ClickableRow href={`/${locale}/settled-transfers`} count={settledTransfersCount} className="hover:bg-purple-50 dark:hover:bg-purple-900">
                                Settled Transfers
                            </ClickableRow>
                        </div>
                    </section>

                    {/* Add more sections as needed */}

                </CardContent>
            </Card>
        </div>
    );
}
