// src/auth.ts
import NextAuth, {Session} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";
import { jwtDecode } from "jwt-decode";
import type { AdapterUser } from "next-auth/adapters";
import type { User as NextAuthUser } from "next-auth";
import {JWT} from "next-auth/jwt";

interface DecodedToken {
    exp: number;
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
                        return {
                            id: user.userId.toString(),
                            email: user.email,
                            name: user.fullName || user.username || user.email,
                            image: user.profileImageUrl,
                            userId: user.userId,
                            username: user.username,
                            fullName: user.fullName,
                            phoneNumber: user.phoneNumber,
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
                    try {
                        const user = JSON.parse(userDataString);

                        return {
                            id: user.userId.toString(),
                            email: user.email,
                            name: user.fullName || user.username || user.email,
                            image: user.profileImageUrl,
                            userId: user.userId,
                            username: user.username,
                            fullName: user.fullName,
                            phoneNumber: user.phoneNumber,
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
        async jwt({
                      token,
                      user,
                      trigger,
                      session
                  }: {
            token: JWT;
            user?: User | AdapterUser;
            trigger?: "signIn" | "update" | "signUp";
            isNewUser?: boolean;
            session?: any;
        }): Promise<JWT> {
            console.log("\n\n[JWT Callback Start] token:", token, ", user:", user, ", trigger:", trigger, ", session:", session);

            const now = Date.now();
            const buffer = 2 * 60 * 1000;

            // 🔁 Handle `useSession().update()` flow
            if (trigger === "update" && session) {
                const updatedToken: JWT = {
                    ...token,
                    accessToken: session.accessToken,
                    accessTokenExpires: session.accessTokenExpires,
                    user: session.user,
                    isExpired: false,
                };
                console.log("[JWT Callback] token updated from session.update:", updatedToken);
                return updatedToken;
            }

            // 🔑 Handle new login
            if (user) {
                const accessToken = token.accessToken || "";
                let accessTokenExpires = 0;

                if (typeof accessToken === "string") {
                    try {
                        const decoded = jwtDecode<DecodedToken>(accessToken);
                        accessTokenExpires = decoded.exp * 1000;
                    } catch (e) {
                        console.error("[JWT Callback] Failed to decode accessToken:", e);
                    }
                }

                return {
                    accessToken,
                    accessTokenExpires,
                    isExpired: Date.now() >= accessTokenExpires,
                    user: {
                        userId: user.userId,
                        username: user.username,
                        fullName: user.fullName,
                        profileImageUrl: user.profileImageUrl,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        enabled: user.enabled,
                        registrationDate: user.registrationDate,
                        roles: user.roles,
                        role: user.role,
                        ekiddako: user.ekiddako,
                    },
                };
            }

            // 🔎 Fallback: calculate expiration
            const expiry = typeof token.accessTokenExpires === 'number' ? token.accessTokenExpires : 0;
            const isExpired = expiry && now >= expiry - buffer;

            token.isExpired = Boolean(isExpired);

            console.log("[JWT Callback End] returning token:", token);
            return token;
        },
        // This callback is called whenever a session is accessed (e.g., via `await auth()` or `useSession()`)
        async session({ session, token }: {
            session: Session;
            token: JWT;
        }): Promise<Session> {
            console.log("\n\n[Session Callback Start] token:", token, ", session:", session);

            session.accessToken = {
                accessToken: token.accessToken,
                accessTokenExpires: token.accessTokenExpires,
                isExpired: token.isExpired ?? false,
            };

            const user = token.user as NextAuthUser & { id?: string };

            session.user = {
                ...user,
                id: user.id ?? user.userId?.toString() ?? "",
                emailVerified: null, // For AdapterUser compatibility
            } as AdapterUser & NextAuthUser;

            console.log("[Session Callback End] updated session:", session);
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
