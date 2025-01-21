"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

export default function SignOutButton() {
  return (
    <ClerkSignOutButton>
      <Button>Sign out</Button>
    </ClerkSignOutButton>
  );
}
