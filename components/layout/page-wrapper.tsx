import SignInButton from "@/components/auth/sign-in";
import ThemeToggle from "@/components/theme/toggle";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteNavLinks, siteNavLinksWithHome } from "@/config/site";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { ReactNode } from "react";
import BackButton from "./back-button";
import NavLinks from "./nav-links";

type Props = {
  backButton?: boolean;
  navChildren?: ReactNode;
  children: ReactNode;
};

export default function PageWrapper({
  backButton,
  navChildren,
  children,
}: Props) {
  return (
    <>
      <div className="flex py-4 gap-4 justify-between items-center">
        {backButton ? (
          <BackButton />
        ) : (
          <>
            <div className="hidden sm:block">
              <NavLinks links={siteNavLinks} />
            </div>
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
          </>
        )}
        <div className="flex items-center justify-between gap-4">
          {navChildren}
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {children}
    </>
  );
}
