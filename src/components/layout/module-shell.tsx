import { TopNavbar } from "@/components/layout/top-navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import type { NavItem } from "@/types/navigation";

interface ModuleShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  pageTitle: string;
  moduleTitle?: string;
  userName?: string | null;
  userEmail?: string | null;
}

export function ModuleShell({
  children,
  navItems,
  pageTitle,
  moduleTitle,
  userName,
  userEmail,
}: ModuleShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <AppSidebar items={navItems} moduleTitle={moduleTitle} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar title={pageTitle} userName={userName} userEmail={userEmail} />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </div>
  );
}
