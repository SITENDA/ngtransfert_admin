// app/[locale]/dashboard/page.tsx
import * as React from "react";
import { Link } from "@/i18n/navigation";

import PublicWrapper from "@/components/PublicWrapper"; // Ensure this component allows its children to fill space
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {redirect} from "next/navigation";

import { getLocale } from "next-intl/server";

export const metadata = {
    title: "Dashboard",
};

export default async function ClientDashboardPage() {
    const session = await auth();
    const user = session?.user;
    console.log("User in dashboard is : ", user);
    const locale = await getLocale();

    if (!user) {
        // Redirect to the login page specific to the current locale
        redirect(`/${locale}/login`); // Changed redirect to /login
        return null;
    }

    // It's good practice to ensure `ekiddako` is also handled here if this page is specific to 'client'
    // For example, if 'dashboard' is only for 'client' role, you might want this:
    // if (user.ekiddako && user.ekiddako !== 'client') {
    //     // If user is not 'client' but lands here, redirect to their correct dashboard
    //     redirect(`/${locale}/${user.ekiddako}`);
    //     return null;
    // }


    return (
        // PublicWrapper should typically be h-full or min-h-screen to allow children to expand
        // If PublicWrapper doesn't provide height, the Card won't expand vertically.
        <PublicWrapper>
            {/* Added 'h-full flex flex-col' to ensure it takes vertical space and allows children to grow */}
            <Card className="w-full flex-grow mx-auto my-8 bg-background text-foreground flex flex-col h-full max-w-screen-lg">
                <CardHeader className="flex flex-row justify-between items-center px-6 py-4"> {/* Adjusted for better alignment */}
                    <CardTitle className="text-2xl font-semibold">Client Dashboard</CardTitle>
                    {/* Corrected href - assuming 'kaasitoma' is a direct segment after locale */}
                    <Link href={'/kaasitoma/add-receiver-account'} passHref>
                        <Button variant="outline" size="sm">
                            Add Receiver Account
                        </Button>
                    </Link>
                </CardHeader>
                {/* CardContent to take available space */}
                <CardContent className="flex-grow p-6"> {/* Added flex-grow and padding */}
                    Testing dashboard
                </CardContent>
                {/*<CardContent>*/}
                {/*    <div className="space-y-4">*/}
                {/*        {users.length > 0 && (*/}
                {/*            <div>*/}
                {/*                <h5 className="text-lg font-semibold">Users:</h5>*/}
                {/*                <ul className="space-y-2">*/}
                {/*                    {users.map((u) => (*/}
                {/*                        <li key={u.id} className="text-sm">*/}
                {/*                            {u.name || "Unnamed"} - {u.email} - Role: {u.role}*/}
                {/*                        </li>*/}
                {/*                    ))}*/}
                {/*                </ul>*/}
                {/*            </div>*/}
                {/*        )}*/}

                {/*        {accounts.length > 0 && (*/}
                {/*            <div>*/}
                {/*                <h5 className="text-lg font-semibold">Accounts:</h5>*/}
                {/*                <ul className="space-y-2">*/}
                {/*                    {accounts.map((account) => (*/}
                {/*                        <li key={account.id} className="text-sm flex items-center justify-between">*/}
                {/*                            <span>{account.provider}</span>*/}
                {/*                            <Link href={`/accounts/${account.id}`}>*/}
                {/*                                <Button variant="outline" size="sm">*/}
                {/*                                    View Details*/}
                {/*                                </Button>*/}
                {/*                            </Link>*/}
                {/*                        </li>*/}
                {/*                    ))}*/}
                {/*                </ul>*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*</CardContent>*/}
            </Card>
        </PublicWrapper>
    );
}