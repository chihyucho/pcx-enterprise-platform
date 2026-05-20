"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/navigation/nav-icon";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";

interface AppSidebarProps {
  items: NavItem[];
  moduleTitle?: string;
}

export function AppSidebar({ items, moduleTitle = "Sales System" }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="text-sm font-semibold text-sidebar-foreground">
          {moduleTitle}
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          if (item.disabled) {
            return (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground/60"
              >
                <NavIcon name={item.icon} />
                {item.title}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              )}
            >
              <NavIcon name={item.icon} />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
