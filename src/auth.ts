// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    theme: {
        logo: "/logo.png",
    },
    // Configure the Credentials Provider
    providers: [
        CredentialsProvider({
            // This name is primarily for display purposes if you were to have a login form.
            // Since we're calling signIn programmatically, it's less critical.
            name: "Spring Boot Credentials",
            // Define the fields that will be passed to the authorize function
            credentials: {
                // The actual JWT token from Spring Boot
                accessToken: { label: "Access Token", type: "text" },
                // The JSON string of the UserDTO fetched from Spring Boot
                userData: { label: "User Data (JSON)", type: "text" },
            },
            async authorize(credentials) {
                // This function is called when `signIn('credentials', { ... })` is invoked.
                // It receives the data you passed into the signIn call.
                const accessToken = credentials.accessToken as string;
                const userDataString = credentials.userData as string;

                if (!accessToken || !userDataString) {
                    // If no token or user data, authentication failed
                    return null;
                }

                try {
                    // Parse the user data JSON string back into an object
                    const userFromSpringBoot = JSON.parse(userDataString);

                    // Perform basic validation on the user data from Spring Boot
                    if (!userFromSpringBoot || !userFromSpringBoot.userId || !userFromSpringBoot.email) {
                        console.error("Invalid user data received in Credentials Provider:", userFromSpringBoot);
                        return null;
                    }

                    // Map your Spring Boot user object to the NextAuth 'user' object.
                    // This 'user' object will be passed to the `jwt` callback.
                    return {
                        // NextAuth's user.id MUST be a string
                        id: userFromSpringBoot.userId.toString(),
                        email: userFromSpringBoot.email,
                        // 'name' is often displayed in UIs, use full name or username
                        name: userFromSpringBoot.fullName || userFromSpringBoot.username || userFromSpringBoot.email,
                        // Store your Spring Boot JWT access token directly here
                        accessToken: accessToken,
                        // Map other relevant fields from your UserDTO
                        username: userFromSpringBoot.username,
                        fullName: userFromSpringBoot.fullName,
                        // Assuming roles is an array and you want the first role name
                        role: userFromSpringBoot.roles?.[0]?.roleName,
                    };
                } catch (e) {
                    console.error("Error processing user data in Credentials Provider:", e);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        // This callback is called whenever a JWT is created (e.g., on sign-in)
        async jwt({ token, user }) {
            // `user` is the object returned by the `authorize` function of the CredentialsProvider
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                // Store your Spring Boot JWT access token in the JWT token object
                token.accessToken = (user as any).accessToken; // Cast to 'any' to access custom property
                // Store other custom user properties
                token.username = (user as any).username;
                token.fullName = (user as any).fullName;
                token.role = (user as any).role;
            }
            return token;
        },
        // This callback is called whenever a session is accessed (e.g., via `await auth()`)
        async session({ session, token }) {
            // `token` is the object returned by the `jwt` callback
            // Populate the session object with properties from the JWT token
            if (token.id) session.user.id = token.id as string;
            if (token.email) session.user.email = token.email as string;
            if (token.name) session.user.name = token.name as string;
            // Expose the access token in the session object
            if (token.accessToken) session.accessToken = token.accessToken as string;
            // Expose other custom user properties
            if (token.username) session.user.username = token.username as string;
            if (token.fullName) session.user.fullName = token.fullName as string;
            if (token.role) session.user.role = token.role as string;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Your existing redirect logic remains unchanged
            console.log("URL is : ", url, "baseUrl is : ", baseUrl);

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