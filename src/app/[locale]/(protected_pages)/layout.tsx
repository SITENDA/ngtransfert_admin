// src/app/[locale]/(protected_pages)/layout.tsx

import getSession from "@/lib/getSession";
import { getLocale } from "next-intl/server";
import { ensureValidAccessToken } from "@/lib/server/ensureValidAccessToken";
import { redirect } from "@/i18n/navigation";
import Header from "@/components/Header";
import {generalPaths} from "@/util/frontend-paths";

export const dynamic = "force-dynamic"; // 🔥 VERY IMPORTANT

export default async function ProtectedLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const session = await getSession();

    // 🔴 HARD STOP #1 — no session
    if (!session) {
        console.log("Logged out due to no session");
        redirect({ href: generalPaths.fromSignedOutLoginPath, locale });
    }
        // 🔴 HARD STOP #2 — no user
    else if (!session.user) {
        console.log("Logged out due to expired session");
        redirect({ href: generalPaths.fromSessionExpiredLoginPath, locale });
    }

    // 🔄 Validate / refresh token
    const ok = session == null ? false : await ensureValidAccessToken(session);

    // 🔴 HARD STOP #3 — refresh failed
    if (!ok) {
        redirect({ href: generalPaths.fromSessionExpiredLoginPath, locale });
    }

    return (
        <>
            <Header />
            <main className="flex-1 w-full bg-background">
                {children}
            </main>
        </>
    );
}
