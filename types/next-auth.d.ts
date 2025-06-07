import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Your JWT access token from Spring Boot
    user: {
      id?: string; // Corresponds to UserDTO's userId (must be string for next-auth)
      email: string;
      username?: string;
      fullName?: string;
      role?: string; // e.g., "USER", "ADMIN" (assuming a single primary role or string representation)
      // Add other properties from your UserDTO as needed
    } & DefaultSession["user"];
  }

  interface User {
    role: String | null;
    id?: string; // Corresponds to UserDTO's userId (must be string for next-auth)
    email: string;
    username?: string;
    fullName?: string;
    role?: string;
  }

  interface JWT {
    accessToken?: string; // Your JWT access token
    id?: string;
    email?: string;
    username?: string;
    fullName?: string;
    role?: string;
  }
}
