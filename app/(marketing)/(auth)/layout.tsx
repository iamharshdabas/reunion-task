import Section from "@/components/layout/section";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <Section>{children}</Section>;
}
