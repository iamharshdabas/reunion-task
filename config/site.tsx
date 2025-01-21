import { CheckCheck } from "lucide-react";

export const siteData = {
  icon: <CheckCheck />,
  title: "Reunion Task",
  // TODO: Add description
  description: "",
};

export const siteHref = {
  home: () => "/",
  dashboard: () => "/dashboard",
};

export type SiteNavLinks = { label: string; href: string }[];

export const siteNavLinksWithHome: SiteNavLinks = [
  {
    label: "Home",
    href: siteHref.home(),
  },
  {
    label: "Dashboard",
    href: siteHref.dashboard(),
  },
];

export const siteNavLinks = siteNavLinksWithHome.filter(
  (link) => link.href !== siteHref.home(),
);
