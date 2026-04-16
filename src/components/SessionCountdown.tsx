//  /home/amos/docure/ngtransfert_admin/src/components/SessionCountdown.tsx

'use client';

import { useSessionTimer } from "@/hooks/useSessionTimer";

function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SessionCountdown() {
    const remainingMs = useSessionTimer();

    if (remainingMs === null) return null;

    return (
        <span className="text-xs text-muted-foreground">
      Session expires in {formatTime(remainingMs)}
    </span>
    );
}
