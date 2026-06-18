import type { NavItem } from "@/types/navigation";

export const SALES_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/sales-system/dashboard",
    icon: "layout-dashboard",
  },
  {
    title: "Follow up",
    href: "/sales-system/follow-ups",
    icon: "calendar-clock",
  },
  {
    title: "Accounts",
    href: "/sales-system/accounts",
    icon: "building-2",
  },
  {
    title: "Activities",
    href: "/sales-system/activities",
    icon: "calendar-days",
    disabled: true,
  },
  {
    title: "Quotes",
    href: "/sales-system/quotes",
    icon: "file-text",
    disabled: true,
  },
];
