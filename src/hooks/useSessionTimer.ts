// src/hooks/useSessionTimer.ts
"use client";

import { useEffect, useState } from "react";

export function useSessionTimer() {
    const [remainingMs, setRemainingMs] = useState<number | null>(null);

    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch("/api/session/status", {
                    credentials: "include",
                });

                if (!res.ok) {
                    setRemainingMs(null);
                    return;
                }

                const data = await res.json();
                setRemainingMs(data.remainingMs);
            } catch {
                setRemainingMs(null);
            }
        }

        fetchStatus();
        const interval: NodeJS.Timeout = setInterval(fetchStatus, 30_000); // every 30s

        return () => clearInterval(interval);
    }, []);

    return remainingMs;
}
