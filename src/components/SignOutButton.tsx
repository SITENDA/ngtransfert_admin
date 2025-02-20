"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignInButton() {
  return <Button onClick={() => signOut()}>Log out</Button>;
}
