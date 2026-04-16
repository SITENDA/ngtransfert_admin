//  src/components/SessionUpdateHandler.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

interface SessionUpdateHandlerProps {
    user?: string;
}

export default function SessionUpdateHandler({
                                                 user,
                                             }: SessionUpdateHandlerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const updateSession = async () => {
            if (!user) {
                router.replace("/login?error=sessionUpdateFailed");
                return;
            }

            try {
                await signIn("credentials", {
                    userData: user,
                    redirect: false,
                });

                const returnTo = searchParams.get("returnTo") || "/dashboard";
                router.replace(returnTo);
            } catch (err) {
                console.error("Session update failed:", err);
                router.replace("/login?error=sessionUpdateFailed");
            }
        };

        updateSession();
    }, [user, router, searchParams]);

    return <p>Refreshing session... please wait.</p>;
}