// types/next-auth.d.ts
import {DefaultSession, DefaultUser} from "next-auth";

// IMPORTANT: Define UserDTO here or import from a shared types file
// This should exactly match the structure you receive from your Spring Boot backend
interface UserDTO {
  userId: number;
  email: string;
  username: string;
  fullName?: string;
  profileImageUrl?: string;
  enabled: boolean;
  registrationDate: string;
  roles: Array<{ id: number; roleName: string }>;
  ekiddako?: string; // Add the new property here
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, `signIn`, `getSession`
   * Contains properties added in the `session` callback.
   */
  interface Session extends DefaultSession {
    accessToken: JWT; // Your JWT from Spring Boot
    user: User;
  }

  /**
   * The shape of the `user` object that will be passed into your `jwt` callback
   * from the `authorize` function.
   */
  interface User extends DefaultUser {
    userId: number; // Original userId from DTO
    username: string;
    fullName?: string;
    profileImageUrl: string;
    phoneNumber: string;
    email: string;
    enabled: boolean;
    registrationDate: string;
    roles: Array<{ id: number; roleName: string }>; // Full roles array
    role?: string; // Primary role (e.g., 'ROLE_CLIENT')
    ekiddako?: string; // Add the new custom property
  }
}

declare module "next-auth/jwt" {
  /**
   * The shape of the JWT that will be created and passed into `session` callback.
   * Contains properties added in the `jwt` callback.
   */
  interface JWT {
    accessToken: string;
    accessTokenExpires?: number;
    isExpired: boolean;
    user?: User; // ✅ Add this line
  }

}