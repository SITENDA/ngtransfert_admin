import React, { ReactNode } from "react";
import {generalPaths} from "@/util/frontend-paths";
import {getLocale} from "next-intl/server";
import {ensureValidAccessToken} from "@/lib/server/ensureValidAccessToken";
import {redirect} from "@/i18n/navigation";
import getSession from "@/lib/getSession"; // Assuming getSession is available

interface ProtectedWrapperProps {
    children: ReactNode;
}

const ProtectedWrapper: React.FC<ProtectedWrapperProps> = async ({ children }) => {
    // The fetchBackendData utility (if used) handles authentication and redirects
    // if the user is not authenticated or the access token is missing.
    const session = await getSession();
    const clientId = session?.user?.userId; // Extract clientId after session is confirmed
    const locale = await getLocale();

    // 🔄 Validate / refresh token
    const ok = session == null ? false : await ensureValidAccessToken(session);

    // 🔴 HARD STOP #3 — refresh failed
    if (!ok || !clientId) {
        console.warn(`ReceiverAccountDetailsPage: Client ID not found after initial session check. 
        Redirecting to ${generalPaths.fromSessionExpiredLoginPath}`);
        redirect({ href: generalPaths.fromSessionExpiredLoginPath, locale });
    }

    return (
        <div className="w-full max-w-3xl mx-auto text-center">
            {children}
        </div>
    );
};

export default ProtectedWrapper;
