import SignInButton from "@/components/auth/sign-in";
import ThemeToggle from "@/components/theme/toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteData, siteNavLinksWithHome } from "@/config/site";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import NavLinks from "./nav-links";

export default function Navbar() {
  return (
    <Sheet>
      <div className="fixed w-full flex justify-center">
        <header className="p-1 sm:p-4 container">
          <div className="flex bg-background/80 backdrop-blur-lg p-2 sm:p-4 rounded-2xl shadow-2xl border border-border justify-between items-center">
            <div className="flex gap-2 items-center">
              <SheetTrigger asChild className="sm:hidden">
                <Button size="icon" variant="outline">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle hidden>Navigation links</SheetTitle>
                <div className="grid pt-8 grid-cols-1 gap-8">
                  <NavLinks flexCol links={siteNavLinksWithHome} />
                </div>
              </SheetContent>
              <span className="hidden sm:block p-2">{siteData.icon}</span>{" "}
              <span>{siteData.title}</span>
            </div>

            <nav className="gap-2 items-center hidden sm:flex">
              <NavLinks links={siteNavLinksWithHome} />
            </nav>

            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </header>
      </div>
    </Sheet>
  );
}
