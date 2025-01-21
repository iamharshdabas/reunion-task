import { SiteNavLinks } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NavLinks({
  links,
  flexCol,
}: {
  links: SiteNavLinks;
  flexCol?: boolean;
}) {
  return (
    <div className={cn("flex gap-8", flexCol && "flex-col")}>
      {links.map((link) => (
        <Link
          key={link.href}
          className={cn(
            !flexCol && "text-muted-foreground hover:text-foreground",
          )}
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
