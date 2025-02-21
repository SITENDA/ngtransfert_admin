import * as React from "react";
import { redirect } from 'next/navigation';

import PublicWrapper from "@/components/PublicWrapper";
import { auth } from "@/auth";

export const metadata = {
    title: "Dashboard",
}

export default async function DashboardPage() {

    const session = await auth();
    const user = session?.user;

    if (!user) { // Check if user is NOT logged in
        redirect("/"); // Redirect to the home page
        return null; // Important: Return null to prevent further rendering
    }

    return (
        <PublicWrapper>
            <h4 className="text-white text-2xl font-semibold mb-3">
            Dashboard
            </h4>
            <p className="text-white/80 text-lg bg-[#230a84]/50 p-4 rounded-lg">
               This is the Dashboard
            </p>
        </PublicWrapper>

    );
}