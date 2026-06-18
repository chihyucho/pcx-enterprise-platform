import type { NavIconName } from "@/types/icons";

export interface NavItem {
  title: string;
  href: string;
  icon: NavIconName;
  disabled?: boolean;
}
