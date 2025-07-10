// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

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
  ekiddako?: string;
  refreshToken?: string;
}

interface RoleDTO {
  id: number;
  roleName: string;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, `signIn`, `getSession`
   * Contains properties added in the `session` callback.
   */
  interface Session {
    accessToken: string; // Your JWT from Spring Boot
    accessTokenExpires?: number;
    refreshToken?: string;
    user: {
      id: string; // NextAuth's user.id is string
      email: string;
      name?: string | null; // From DefaultSession.user (often fullName or username)
      image?: string | null; // From DefaultSession.user (often profileImageUrl)

      // --- Add ALL UserDTO properties here ---
      userId: number; // Original userId from DTO
      username: string;
      fullName?: string;
      profileImageUrl?: string; // Directly passed image URL
      enabled: boolean;
      registrationDate: string;
      roles: Array<{ id: number; roleName: string }>; // Full roles array
      role?: string; // Primary role (e.g., 'ROLE_CLIENT'), derived from roles array
      ekiddako?: string; // Add the new custom property
    } & DefaultSession["user"]; // Merge with default user properties
  }

  /**
   * The shape of the `user` object that will be passed into your `jwt` callback
   * from the `authorize` function.
   */
  interface User extends DefaultUser {
    accessToken: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    // --- Add ALL UserDTO properties here ---
    userId: number; // Original userId from DTO
    username: string;
    fullName?: string;
    profileImageUrl?: string;
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
    accessToken: string; // Your JWT from Spring Boot, Make optional as it might be null if expired/invalidated
    accessTokenExpires?: number; // Add this for the JWT expiration timestamp (Unix seconds)
    refreshToken?: string;
    // --- Add ALL UserDTO properties here, matching the types from your DTO ---
    // Make them optional as they might not always be present or valid after expiration checks
    userId?: number;
    username?: string;
    fullName?: string;
    profileImageUrl?: string;
    enabled?: boolean;
    registrationDate?: string;
    roles?: RoleDTO[]; // Use the defined RoleDTO and make optional
    role?: string;
    ekiddako?: string;
  }
}