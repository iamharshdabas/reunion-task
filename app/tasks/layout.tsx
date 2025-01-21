import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <main className="container mx-auto px-4">{children}</main>;
}
