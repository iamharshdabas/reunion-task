"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button asChild size="icon" variant="outline" onClick={() => router.back()}>
      <ChevronLeft />
    </Button>
  );
}
