'use client'; // This context will be used by client components

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode
} from 'react';
import { useSession, signOut } from 'next-auth/react'; // Import hooks from next-auth/react
// import { useRouter } from 'next/navigation'; // Not strictly needed here, unless you want to redirect immediately on logout from this context
import { useLocale } from 'next-intl';
import {Session} from "next-auth";
import {RoleDTO} from "../../types/next-auth"; // Import NextAuth's User type to properly type session.user

// 1. Define the shape of your AuthUser data for the client context
// This will be the actual shape of the `user` state in your AuthContext
// This should closely mirror what you put into NextAuth's session.user
interface AuthUser {
    id: string; // NextAuth's user.id is always a string
    email: string;
    username: string;
    fullName?: string;
    profileImageUrl?: string;
    enabled: boolean;
    registrationDate: string;
    roles: RoleDTO[]; // Use your specific RoleDTO type
    role?: string; // Primary role derived from roles array
    accessToken?: string; // The Spring Boot JWT
    ekiddako?: string; // Add your custom ekiddako property
    userId: number; // The original numeric userId from your backend
}

// 2. Define the shape of your AuthContext state
interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean; // True while session is being fetched/initialized
    // Removed 'login' as it's now handled implicitly by NextAuth.js's signIn()
    logout: () => void;
}

// 3. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Create the Provider Component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Correctly type the session data from useSession
    const { data: session, status } = useSession() as {
        data: Session & { accessToken?: string; ekiddako?: string; userId?: number; username?: string; fullName?: string; profileImageUrl?: string; enabled?: boolean; registrationDate?: string; roles?: RoleDTO[]; } | null; // Extend with your custom properties
        status: 'loading' | 'authenticated' | 'unauthenticated';
    };
    const currentLocale = useLocale();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // This useEffect syncs the next-auth session with your custom AuthContext
    useEffect(() => {
        if (status === 'loading') {
            setLoading(true);
            // Optionally, clear user data while loading to prevent stale data display
            setUser(null);
            setIsAuthenticated(false);
            return;
        }

        if (status === 'authenticated' && session) {
            // Ensure `session.user` and `session.accessToken` are properly handled
            // and mapped to your `AuthUser` type.
            // Using optional chaining and nullish coalescing for safety.
            const userRoles = session.roles ? session.roles.map((r: any) => ({ id: r.id, roleName: r.roleName })) : [];
            const userPrimaryRole = userRoles.length > 0 ? userRoles[0].roleName : undefined;

            const authUser: AuthUser = {
                // Ensure 'id' is a string as NextAuth expects
                id: session.user.id || (session.userId ? String(session.userId) : ''),
                userId: session?.userId || 0, // Ensure numeric userId is stored
                email: session.user.email || '',
                username: session.username || '', // Use custom username
                fullName: session.fullName || undefined,
                profileImageUrl: session.profileImageUrl || undefined,
                enabled: session.enabled ?? false,
                registrationDate: session.registrationDate || '',
                roles: userRoles,
                role: userPrimaryRole,
                accessToken: session.accessToken || undefined,
                ekiddako: session.ekiddako || undefined, // Your custom ekiddako property
            };
            setUser(authUser);
            setIsAuthenticated(true);
            setLoading(false);
            // console.log('AuthContext: User authenticated from NextAuth session with full data.');
        } else if (status === 'unauthenticated') {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            // console.log('AuthContext: User unauthenticated by NextAuth session.');
        }
    }, [session, status]); // Re-run effect whenever session data or status changes

    // Removed the 'login' function, as NextAuth's signIn will handle populating the session.
    // Your OAuth2Handler will call signIn, which then triggers the NextAuth session,
    // and this useEffect will react to it.

    // Function to handle logout
    const logout = useCallback(async () => {
        setLoading(true);
        console.log('AuthContext: Initiating logout via NextAuth.');
        // next-auth/react's signOut will clear cookies and redirect
        await signOut({
            redirect: true,
            callbackUrl: `/${currentLocale}/login`, // Ensure this matches what performFullLogoutAndRedirect uses
        });
        // The state will be cleared by the useEffect when status changes to 'unauthenticated'
    }, [currentLocale]);

    const contextValue = {
        user,
        isAuthenticated,
        loading,
        // login, // Removed
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 5. Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};