// src/app/[locale]/(protected_pages)/layout.tsx
import getSession from "@/lib/getSession";
import {redirect} from "next/navigation";
import {getLocale} from "next-intl/server";
import SessionUpdater from "@/app/[locale]/(protected_pages)/SessionUpdater";
import {JWT} from "next-auth/jwt";
import {User} from "next-auth";
import {refreshAccessTokenServer} from "@/lib/server/refreshAccessTokenServer";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default async function ProtectedLayout({children}: ProtectedLayoutProps) {
    const session = await getSession();
    const locale = await getLocale();

    const user: User | undefined = session?.user;
    const token: JWT | undefined = session?.accessToken;

    if (!session || !user) {
        redirect(`/${locale}/login`);
    }

    // console.log("User in ProtectedLayout is : ", user);
    // console.log("Token in ProtectedLayout is : ", session.accessToken);
    // console.log("Session in ProtectedLayout is : ", session);

    let canRefresh = true;

    if (token?.isExpired) {
        const refreshed = await refreshAccessTokenServer();

        if (!refreshed.success) {
            console.error("❌ Failed to refresh token:", refreshed.message);
            canRefresh = false;
            return (
                <>
                    {children}
                    <SessionUpdater tokenIsExpired={token?.isExpired ?? false} canRefresh={canRefresh}/>
                </>
            );
        } else {
            // Optionally you could call `signIn("credentials", ...)` here if you want to update session
            console.log("✅ Token refreshed in server layout:", refreshed);
            const refreshResults = {
                accessToken: refreshed.accessToken,
                accessTokenExpires: refreshed.accessTokenExpires,
                user: refreshed.user,
            }

            return (
                <>
                    {children}
                    <SessionUpdater tokenIsExpired={token?.isExpired ?? false} canRefresh={canRefresh}
                                    refreshResults={refreshResults}/>
                </>
            );
        }
    } else {
        return (
            <>
                {children}
                <SessionUpdater tokenIsExpired={token?.isExpired ?? false} canRefresh={canRefresh}/>
            </>
        )
    }

}
