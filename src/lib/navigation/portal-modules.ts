import type { PortalModule } from "@/types/module";

export const PORTAL_MODULES: PortalModule[] = [
  {
    id: "sales-system",
    title: "Sales System",
    description:
      "Manage accounts, activities, and quotes across the sales pipeline.",
    href: "/sales-system/dashboard",
    icon: "trending-up",
    enabled: true,
  },
  {
    id: "order-system",
    title: "Order System",
    description: "Process and track customer orders. Coming soon.",
    href: "/order-system",
    icon: "package",
    enabled: false,
  },
  {
    id: "admin",
    title: "Admin",
    description: "Platform configuration and user management. Coming soon.",
    href: "/admin",
    icon: "settings",
    enabled: false,
  },
];
