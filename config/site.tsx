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
  tasks: () => "/tasks",
  taskNew: () => "/tasks/new",
  taskEdit: (id: string) => `/tasks/${id}/edit`,
};

export function createURL(
  href: string,
  oldParams: Record<string, string>,
  newParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(oldParams);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value == undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  return `${href}?${params.toString()}`;
}

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
  {
    label: "Tasks",
    href: siteHref.tasks(),
  },
];

export const siteNavLinks = siteNavLinksWithHome.filter(
  (link) => link.href !== siteHref.home(),
);
