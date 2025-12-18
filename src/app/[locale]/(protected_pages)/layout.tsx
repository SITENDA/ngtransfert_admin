// src/app/[locale]/(protected_pages)/layout.tsx

import getSession from "@/lib/getSession";
import { getLocale } from "next-intl/server";
import { ensureValidAccessToken } from "@/lib/server/ensureValidAccessToken";
import { redirect } from "@/i18n/navigation";
import Header from "@/components/Header";

export default async function ProtectedLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const session = await getSession();

    if (!session) {
        redirect({ href: "/login?ensobi=signedout", locale });
    }

    if (session == null || !session.user) {
        redirect({ href: "/login", locale });
    }

    const ok = await ensureValidAccessToken(session);
    if (!ok) {
        redirect({ href: "/login?ensobi=signedout", locale });
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
