import { siteNavLinks } from "@/config/site";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";
import ThemeToggle from "../theme/toggle";
import BackButton from "./back-button";
import NavLinks from "./nav-links";
import NavSheet from "./nav-sheet";

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
            <div className="sm:hidden">
              <NavSheet />
            </div>
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
