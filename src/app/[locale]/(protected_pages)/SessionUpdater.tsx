"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

function SessionUpdater() {

    const { data: session, update } = useSession();

    useEffect(() => {
        const fetchSession = async () => {
            if (session) {
                console.log("Session Updater: Full session object →", session);
                console.log("Session Updater: User →", session.user);
                console.log("Session Updater: Access Token →", session.accessToken); // cast needed if not in default type
                await updateSession();
                console.log("New session token : ",  session.accessToken);
            } else {
                console.warn("Session Updater: No session found.");
            }

            async function updateSession() {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        accessToken: "newwwww"
                    }
                })
            }
        };

        fetchSession();
    }, []);

    return <div>Testing session update</div>;
}

export default SessionUpdater;
