"use client";

import {useEffect} from "react";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "@/i18n/navigation";
import {generalPaths} from "@/util/frontend-paths";
import {useLocale} from "next-intl"; // Assuming this is wrapped properly

function SessionUpdater() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const locale = useLocale();

    useEffect(() => {
        if (status === "loading") return;

        console.log("Session user in session updater : ", session?.user);
        console.log("Session token in session updater : ", session?.accessToken);

        // If session is missing or accessToken is missing, sign the user out
        if (!session || !session.user || !session.accessToken) {
            window.location.replace(`/${locale}${generalPaths.loginPath}?ensobi=signedout`);
            signOut({
                redirect: true,
                callbackUrl: `/${locale}${generalPaths.loginPath}?ensobi=signedout`,
            });
        }
    }, [locale, router, session, status]);

    return null; // Optional: remove UI from rendering
}

export default SessionUpdater;
