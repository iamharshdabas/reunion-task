import SignInButton from "@/components/auth/sign-in";
import ThemeToggle from "@/components/theme/toggle";
import { siteData, siteNavLinksWithHome } from "@/config/site";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavLinks from "./nav-links";

export default function Navbar() {
  return (
    <div className="fixed w-full flex justify-center">
      <header className="p-1 sm:p-4 container">
        <div className="flex bg-background/80 backdrop-blur-lg p-2 sm:p-4 rounded-2xl shadow-2xl border border-border justify-between items-center">
          <div className="flex gap-2 items-center">
            {siteData.icon}
            <span className="hidden sm:block">{siteData.title}</span>
          </div>
          <nav className="flex gap-2 items-center">
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
  );
}
