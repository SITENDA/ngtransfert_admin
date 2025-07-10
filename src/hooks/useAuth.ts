// hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await fetch("/api/auth/session");
                if (response.ok) {
                    const data = await response.json();
                    setSession(data);
                } else {
                    setSession(null);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
                setSession(null);
            } finally {
                setLoading(false);
            }
        }

        fetchSession();
    }, []);

    return { session, loading };
}