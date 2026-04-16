//  src/components/SessionResetter.tsx

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'next-auth/react';

export default function SessionResetter() {
    const searchParams = useSearchParams();
    const forceSignOut = searchParams.get('forceSignOut');
    const { logout } = useAuth();

    useEffect(() => {
        if (forceSignOut === 'true') {
            console.info('SessionResetter: Clearing client-side AuthContext...');
            logout(); // Clear AuthContext state
            signOut({ redirect: false }); // Ensure NextAuth client state is cleared
        }
    }, [forceSignOut, logout]);

    return null;
}
