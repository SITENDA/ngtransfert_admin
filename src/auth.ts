import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "./lib/prisma";
import EmailProvider from "next-auth/providers/email"; // Import email provider



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