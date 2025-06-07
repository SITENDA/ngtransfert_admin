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

// Re-define UserDTO here or import from a shared types file if available
// This is the source structure for the data coming from your backend
interface UserDTO {
    userId: number;
    email: string;
    username: string;
    fullName?: string;
    profileImageUrl?: string;
    enabled: boolean;
    registrationDate: string;
    roles: Array<{ id: number; roleName: string }>;
}

// 1. Define the shape of your AuthUser data for the client context
// This will be the actual shape of the `user` state in your AuthContext
interface AuthUser {
    id: number | string; // Maps to UserDTO.userId
    email: string;
    username: string;
    fullName?: string;
    profileImageUrl?: string;
    enabled: boolean;
    registrationDate: string;
    roles: Array<{ id: number; roleName: string }>;
    role?: string; // Primary role derived from roles array
    accessToken?: string; // The Spring Boot JWT
}

// 2. Define the shape of your AuthContext state
interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean; // True while session is being fetched/initialized
    // Adjust login signature to accept full UserDTO and accessToken
    login: (fetchedUserDto: UserDTO, accessToken: string) => void;
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
    const { data: session, status } = useSession();
    const currentLocale = useLocale();

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
            const userRoles = session.user.roles ? session.user.roles.map((r: any) => ({ id: r.id, roleName: r.roleName })) : [];
            const userPrimaryRole = userRoles.length > 0 ? userRoles[0].roleName : undefined;

            const authUser: AuthUser = {
                id: session.user.id || '',
                email: session.user.email || '',
                username: session.user.username || '',
                fullName: session.user.fullName || undefined,
                profileImageUrl: session.user.profileImageUrl || undefined,
                enabled: session.user.enabled ?? false, // Default to false if undefined
                registrationDate: session.user.registrationDate || '',
                roles: userRoles,
                role: userPrimaryRole,
                accessToken: session.accessToken || undefined,
            };
            setUser(authUser);
            setIsAuthenticated(true);
            setLoading(false);
            console.log('AuthContext: User authenticated from NextAuth session with full data.');
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
        (fetchedUserDto: UserDTO, accessToken: string) => {
            const userPrimaryRole = fetchedUserDto.roles && fetchedUserDto.roles.length > 0
                ? fetchedUserDto.roles[0].roleName
                : undefined;

            const newUser: AuthUser = {
                id: fetchedUserDto.userId,
                email: fetchedUserDto.email,
                username: fetchedUserDto.username,
                fullName: fetchedUserDto.fullName,
                profileImageUrl: fetchedUserDto.profileImageUrl,
                enabled: fetchedUserDto.enabled,
                registrationDate: fetchedUserDto.registrationDate,
                roles: fetchedUserDto.roles,
                role: userPrimaryRole, // Set primary role here
                accessToken: accessToken,
            };
            setUser(newUser);
            setIsAuthenticated(true);
            console.log('AuthContext: Manual login successful with full UserDTO.');
        },
        []
    );

    // Function to handle logout
    const logout = useCallback(async () => {
        setLoading(true);
        await signOut({
            redirect: true,
            callbackUrl: `/${currentLocale}/login`,
        });
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