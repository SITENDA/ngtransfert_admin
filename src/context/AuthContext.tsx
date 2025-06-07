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
import { useRouter } from 'next/navigation'; // For client-side navigation
import { useLocale } from 'next-intl'; // Assuming next-intl for locale awareness

// 1. Define the shape of your User data for the client context
// This should mirror the key info you expect to frequently access client-side
interface AuthUser {
    id: number | string; // userId from your DTO
    email: string;
    username?: string;
    role?: string; // Primary role
    accessToken?: string; // The Spring Boot JWT. Be cautious storing this in client-side state
    // Add other relevant user properties you need client-side
}

// 2. Define the shape of your AuthContext state
interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean; // True while session is being fetched/initialized
    login: (
        accessToken: string,
        email: string,
        userId: number | string,
        username?: string,
        role?: string
    ) => void;
    logout: () => void;
    // Add other functions or states as needed, e.g., `updateProfile`
}

// 3. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Create the Provider Component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // `useSession` from next-auth/react allows us to access the session in client components
    const { data: session, status } = useSession();
    const router = useRouter();
    const currentLocale = useLocale(); // Get the current locale from next-intl

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // This useEffect syncs the next-auth session with your custom AuthContext
    useEffect(() => {
        if (status === 'loading') {
            setLoading(true);
            return;
        }

        if (status === 'authenticated' && session) {
            // Map the next-auth session user to your AuthUser type
            // Ensure properties match what you stored in next-auth's `session` callback
            const authUser: AuthUser = {
                id: session.user.id || '', // Ensure id is always present or handle null
                email: session.user.email || '', // Ensure email is always present
                username: session.user.username || '',
                role: session.user.role || '',
                accessToken: session.accessToken || '', // Your Spring Boot JWT
            };
            setUser(authUser);
            setIsAuthenticated(true);
            setLoading(false);
            console.log('AuthContext: User authenticated from NextAuth session.');
        } else if (status === 'unauthenticated') {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            console.log('AuthContext: User unauthenticated by NextAuth session.');
        }
    }, [session, status]);

    // Function to manually set client-side user data after a successful login (e.g., from OAuth2 redirect)
    // This is called by your `OAuth2Handler.tsx` after `signIn` is successful.
    const login = useCallback(
        (
            accessToken: string,
            email: string,
            userId: number | string,
            username?: string,
            role?: string
        ) => {
            const newUser: AuthUser = {
                id: userId,
                email,
                username,
                role,
                accessToken,
            };
            setUser(newUser);
            setIsAuthenticated(true);
            console.log('AuthContext: Manual login successful.');
        },
        []
    );

    // Function to handle logout
    const logout = useCallback(async () => {
        setLoading(true);
        // Call next-auth's signOut function, which clears the session cookie
        // and can redirect to a specified page.
        await signOut({
            redirect: true, // Let next-auth handle the redirect
            callbackUrl: `/${currentLocale}/login`, // Redirect to your login page with current locale
        });
        // State will be updated by the useEffect when next-auth status changes to 'unauthenticated'
        console.log('AuthContext: Logout initiated.');
    }, [currentLocale]);

    const contextValue = {
        user,
        isAuthenticated,
        loading,
        login,
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