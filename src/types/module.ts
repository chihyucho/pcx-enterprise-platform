import type { NavIconName } from "@/types/icons";

export interface PortalModule {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: NavIconName;
  enabled: boolean;
}
