import * as React from "react";
import { redirect } from 'next/navigation';
import {Account, User} from "next-auth";
import { Link } from "@/i18n/navigation"

import PublicWrapper from "@/components/PublicWrapper";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const metadata = {
    title: "Dashboard",
};


export default async function DashboardPage() {
    const session = await auth();
    const user = session?.user;
    console.log("User is : ", user);

    if (!user) {
        redirect("/");
        return null;
    }
    // Log the keys of the user object
    if (user) {
        console.log("User Keys:", Object.keys(user));
    }

    // Fetch users using Prisma
    let users: User[] = [];
    let accounts: Account[] = [];
    try {
        users = await prisma.user.findMany();
        accounts = await prisma.account.findMany();
        console.log("Fetched Users:", users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }

    return (
        <PublicWrapper>
            <h4 className="text-white text-2xl font-semibold mb-3">
                Dashboard
            </h4>

            {/* Display fetched users */}

            {users.length > 0 && (
                <div>
                    <h5 className="text-white font-semibold mt-4">Users:</h5>
                    <ul>
                        {users.map((u) => (
                            <li key={u.id} className="text-white/80">
                                {u.name || "Unnamed"} - {u.email} - Role: {u.role}
                            </li>
                        ))}
                        {accounts.length > 0 && (accounts.map((u) => (
                            <li key={u.userId} className="text-white/80">
                                {u.provider}
                            </li>
                        )))}
                    </ul>
                </div>
            )}
        </PublicWrapper>
    );
}