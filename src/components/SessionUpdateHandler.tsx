'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SessionUpdateHandler({ token, user }: { token?: string; user?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const updateSession = async () => {
            if (!token || !user) {
                router.replace('/login?error=sessionUpdateFailed');
                return;
            }

            try {
                await signIn('credentials', {
                    accessToken: token,
                    userData: user,
                    redirect: false
                });

                // Redirect back to the original path if available
                const returnTo = searchParams.get('returnTo') || '/dashboard';
                router.replace(returnTo);
            } catch (err) {
                console.error('Session update failed:', err);
                router.replace('/login?error=sessionUpdateFailed');
            }
        };

        updateSession();
    }, [token, user, router, searchParams]);

    return <p>Refreshing session... please wait.</p>;
}
