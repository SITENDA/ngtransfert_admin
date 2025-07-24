// src/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { decodeJwtExpiry } from "@/util/decodeJwtExpiry";
import type { User } from "next-auth";

interface RoleDTO {
    id: number;
    roleName: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    theme: {
        logo: "/logo.png",
    },
    // Configure the Credentials Provider
    providers: [
        CredentialsProvider({
            name: "Spring Boot Credentials",

            // These fields appear in the default sign-in form
            // Not used when calling signIn programmatically
            credentials: {
                email: { label: "Email", type: "text" },
                phoneNumber: { label: "Phone Number", type: "text" },
                password: { label: "Password", type: "password" },
                identifier: { label: "Identifier", type: "text" },
            },

            async authorize(
                credentials: Partial<Record<"email" | "phoneNumber" | "password" | "identifier" |  "accessToken" | "userData" | "accessTokenExpires", unknown>>,
            ): Promise<User | null> {
                if (!credentials) return null;


                const email = credentials.email as string | undefined;
                const phoneNumber = credentials.phoneNumber as string | undefined;
                const password = credentials.password as string | undefined;
                const identifier = credentials.identifier as string | undefined;
                const accessToken = credentials.accessToken as string | undefined;
                const userDataString = credentials.userData as string | undefined;
                const rawAccessTokenExpires = credentials.accessTokenExpires as string | undefined;

                // Optional: Add a type guard here
                if ((email || phoneNumber) && password && identifier) {
                    try {
                    // Perform email/password login via Spring Boot
                    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, phoneNumber, password, identifier }),
                    });

                    const responseData = await backendResponse.json();

                    const user = responseData?.data?.user;
                    const token = responseData?.data?.token;

                    if (
                        backendResponse.ok &&
                        responseData.statusCode === 200 &&
                        user &&
                        token
                    ) {
                        const user = responseData.data.user;
                        const accessToken = responseData.data.token;
                        const accessTokenExpires = responseData.data.expiresAt;

                        return {
                            id: user.userId.toString(),
                            email: user.email,
                            name: user.fullName || user.username || user.email,
                            image: user.profileImageUrl,
                            accessToken,
                            accessTokenExpires,
                            userId: user.userId,
                            username: user.username,
                            fullName: user.fullName,
                            profileImageUrl: user.profileImageUrl,
                            enabled: user.enabled,
                            registrationDate: user.registrationDate,
                            roles: user.roles,
                            role: user.roles?.[0]?.roleName,
                            ekiddako: user.ekiddako,
                        };
                    }
                    else {
                        console.warn("Login failed with backend response:", responseData);
                    }
                    return null;

                    } catch (err) {
                        console.error("authorize() error during login request:", err);
                        return null;
                    }
                }

                // If OAuth2-like login with token + user data
                if (accessToken && userDataString) {
                    const accessTokenExpires = rawAccessTokenExpires
                        ? parseInt(rawAccessTokenExpires, 10)
                        : decodeJwtExpiry(accessToken);

                    try {
                        const user = JSON.parse(userDataString);

                        return {
                            id: user.userId.toString(),
                            email: user.email,
                            name: user.fullName || user.username || user.email,
                            image: user.profileImageUrl,
                            accessToken,
                            accessTokenExpires,
                            userId: user.userId,
                            username: user.username,
                            fullName: user.fullName,
                            profileImageUrl: user.profileImageUrl,
                            enabled: user.enabled,
                            registrationDate: user.registrationDate,
                            roles: user.roles || [],
                            role: user.roles?.[0]?.roleName,
                            ekiddako: user.ekiddako,
                        };
                    } catch (e) {
                        console.error("Failed to parse userData JSON:", e);
                        return null;
                    }
                }

                console.error("Missing email/password or accessToken/userData.");
                return null;
            }

        }),
    ],
    callbacks: {
        // This callback is called whenever a JWT is created (e.g., on sign-in)
        async jwt({ token, user, trigger, session }) {

            if (trigger === "update") {
                console.log("Update trigger has been called");
                return { ...token, ...session.user };
            }
            // `user` is the object returned by the `authorize` function of the CredentialsProvider
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image; // Transfer the image URL
                token.accessToken = user.accessToken;
                token.accessTokenExpires = user.accessTokenExpires;
                // --- Transfer all custom properties from `User` to `JWT` token ---
                token.userId = user.userId; // Cast to any because TS might complain without explicit type for user
                token.username = user.username;
                token.fullName = user.fullName;
                token.profileImageUrl = user.profileImageUrl;
                token.enabled = user.enabled;
                token.registrationDate = user.registrationDate;
                token.roles = user.roles;
                token.role = user.role;
                token.ekiddako = user.ekiddako; // Transfer new property
            }
            return token;
        },
        // This callback is called whenever a session is accessed (e.g., via `await auth()`)
        // This callback is called whenever a session is accessed (e.g., via `await auth()` or `useSession()`)
        async session({ session, token }) {
            // `token` is the object returned by the `jwt` callback
            // Populate the session object with properties from the JWT token

            if (token.id) session.user.id = token.id as string;
            if (token.email) session.user.email = token.email as string;
            if (token.name) session.user.name = token.name as string;
            if (token.image) session.user.image = token.image as string; // Transfer image to session.user
            if (token.accessToken) session.accessToken = token.accessToken as string; // Expose JWT in session root

            // --- Expose all custom properties from `JWT` token to `Session.user` ---
            if (token.userId) session.user.userId = token.userId as number;
            if (token.username) session.user.username = token.username as string;
            if (token.fullName) session.user.fullName = token.fullName as string;
            if (token.profileImageUrl) session.user.profileImageUrl = token.profileImageUrl as string;
            if (token.enabled !== undefined) session.user.enabled = token.enabled as boolean;
            if (token.registrationDate) session.user.registrationDate = token.registrationDate as string;
            if (token.roles) session.user.roles = token.roles as RoleDTO[];
            if (token.role) session.user.role = token.role as string;
            if (token.ekiddako) session.user.ekiddako = token.ekiddako as string; // Transfer new property

            if (token.accessTokenExpires) {
                session.accessTokenExpires = token.accessTokenExpires as number; // ✅ Add this
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Your existing redirect logic remains unchanged

            const sanitizeURL = (urlString: string | null | undefined): string => {
                if (!urlString) return ""; // Handle null or undefined

                let trimmedURL = urlString.trim(); // Remove leading/trailing spaces

                // Remove trailing slash if present (but not if it's the root path "/")
                if (trimmedURL.endsWith("/") && trimmedURL.length > 1) {
                    trimmedURL = trimmedURL.slice(0, -1);
                }

                return trimmedURL;
            };

            const sanitizedUrl = sanitizeURL(url);
            const sanitizedBaseUrl = sanitizeURL(baseUrl);

            // 1. Check if the user is signing in for the first time (no return URL)
            if (!sanitizedUrl || sanitizedUrl === sanitizedBaseUrl || sanitizedUrl === "/") {
                return `${baseUrl}/dashboard`; // Redirect to dashboard
            }

            // 2. Otherwise, handle redirects as before (relative or absolute)
            if (sanitizedUrl.startsWith("/")) {
                return `${baseUrl}${sanitizedUrl}`; // If relative, prepend baseUrl
            } else if (new URL(sanitizedUrl).origin === new URL(sanitizedBaseUrl).origin) {
                return sanitizedUrl; // If same origin, return url
            }

            return baseUrl; // Otherwise, redirect to the baseUrl (your dashboard)
        },
    },
    // Use JWT strategy for session management (this is the default when no adapter is used)
    session: {
        strategy: "jwt",
    },
    // A secret is required for signing the JWT. Store it in your .env.local
    secret: process.env.NEXTAUTH_SECRET,
    // You might want custom pages for errors, though the redirect page handles primary errors
    pages: {
        error: '/auth/error', // Redirect to this page on authentication errors
    },
});
