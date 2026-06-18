"use client";

import {
  Building2,
  CalendarClock,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { NavIconName } from "@/types/icons";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<NavIconName, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "calendar-clock": CalendarClock,
  "building-2": Building2,
  "calendar-days": CalendarDays,
  "file-text": FileText,
  "trending-up": TrendingUp,
  package: Package,
  settings: Settings,
};

interface NavIconProps {
  name: NavIconName;
  className?: string;
}

export function NavIcon({ name, className }: NavIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon className={cn("h-4 w-4 shrink-0", className)} />;
}
