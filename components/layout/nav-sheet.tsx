import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteNavLinks } from "@/config/site";
import { Menu } from "lucide-react";
import NavLinks from "./nav-links";

export default function NavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle hidden>Navigation links</SheetTitle>
        <div className="grid pt-8 grid-cols-1 gap-8">
          <NavLinks flexCol links={siteNavLinks} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
