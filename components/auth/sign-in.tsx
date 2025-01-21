"use client";

import { Button } from "@/components/ui/button";
import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";

export default function SignInButton() {
  return (
    <ClerkSignInButton>
      <Button>Sign In</Button>
    </ClerkSignInButton>
  );
}
