import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "./lib/prisma";
import EmailProvider from "next-auth/providers/nodemailer";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    theme: {
        logo: "/logo.png",
    },
    adapter: PrismaAdapter(prisma) as Adapter,
    callbacks: {
        session({ session, user }) {
            session.user.role = user.role;
            return session;
        },
        async redirect({ url, baseUrl }) {
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
    providers: [
        EmailProvider({
            id: 'email',
            name: 'email',
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        }),
        Google,
        GitHub,
    ],
});