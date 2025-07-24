"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { generalPaths } from "@/util/frontend-paths";
import { useLocale } from "next-intl";
import { User } from "next-auth";

interface RefreshResults {
    accessToken: string;
    accessTokenExpires: number;
    user: User;
}

function SessionUpdater({
                            tokenIsExpired,
                            canRefresh = true,
                            refreshResults,
                        }: {
    tokenIsExpired: boolean;
    canRefresh: boolean;
    refreshResults?: RefreshResults;
}) {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const locale = useLocale();
    const [updated, setUpdated] = useState(false); // 🆕 track update

    // 🔴 Sign out if refresh failed
    useEffect(() => {
        if (!canRefresh) {
            console.error("🚫 Cannot refresh token, signing out...");

            signOut({ redirect: false }).then(() => {
                setTimeout(() => {
                    router.push(
                        `/${locale}${generalPaths.loginPath}?ensobi=signedout`
                    );
                }, 2000);
            });
        }
    }, [canRefresh, locale, router]);

    // 🔁 Update session only once
    useEffect(() => {
        const doSessionUpdate = async () => {
            if (
                tokenIsExpired &&
                refreshResults &&
                refreshResults.accessToken &&
                refreshResults.user &&
                !updated
            ) {
                console.log("🔁 Updating session with refreshed token and user...");
                try {
                    await update({
                        accessToken: refreshResults.accessToken,
                        accessTokenExpires: refreshResults.accessTokenExpires,
                        user: refreshResults.user,
                    });
                    setUpdated(true); // ✅ mark update as done
                    console.log("✅ Session updated.");
                } catch (error) {
                    console.error("❌ Failed to update session:", error);
                }
            }
        };

        doSessionUpdate();
    }, [tokenIsExpired, refreshResults, update, session, updated]);

    // 🟡 Invalidate session if broken
    useEffect(() => {
        if (status === "loading") return;

        if (!session || !session.user || !session.accessToken) {
            console.warn("⚠️ Session invalid, forcing logout.");
            window.location.replace(
                `/${locale}${generalPaths.loginPath}?ensobi=signedout`
            );
            signOut({
                redirect: true,
                callbackUrl: `/${locale}${generalPaths.loginPath}?ensobi=signedout`,
            });
        }
    }, [locale, router, session, status]);

    return null;
}

export default SessionUpdater;