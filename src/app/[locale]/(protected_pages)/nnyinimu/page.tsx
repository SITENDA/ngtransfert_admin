import * as React from "react";
import { Link } from "@/i18n/navigation";

import PublicWrapper from "@/components/PublicWrapper";
import getSession from "@/lib/getSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {redirect} from "next/navigation";

export const metadata = {
    title: "Dashboard",
};

export default async function AdminDashboardPage() {
    const session = await getSession();
    const user = session?.user;
    // console.log("User in dashboard is : ", user);

    if (!user) {
        redirect("/");
        return null;
    }

    // Fetch users and accounts using Prisma
    // let users: User[] = [];
    // let accounts: Account[] = [];
    // try {
    //     users = await prisma.user.findMany();
    //     accounts = await prisma.account.findMany();
    // } catch (error) {
    //     console.error("Error fetching data:", error);
    // }

    return (
        <PublicWrapper>
            <Card className="w-[80%] mx-auto my-8 bg-background text-foreground">
                <CardHeader className="flex justify-between">
                    <CardTitle className="text-2xl font-semibold">Admin Dashboard</CardTitle>
                    <Link href="/dashboard/add-receiver-account">
                        <Button variant="outline" size="sm">
                            Add Receiver Account
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>Testing dashboard</CardContent>
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