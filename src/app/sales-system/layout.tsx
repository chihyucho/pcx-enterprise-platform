import { createClient } from "@/lib/supabase/server";
import { ModuleShell } from "@/components/layout/module-shell";
import { getUserDisplayInfo, userDisplayLabel } from "@/lib/auth/user";
import { SALES_NAV_ITEMS } from "@/lib/navigation/sales-nav";

export default async function SalesSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserDisplayInfo();

  return (
    <ModuleShell
      navItems={SALES_NAV_ITEMS}
      pageTitle="Sales System"
      moduleTitle="Sales System"
      userName={user ? userDisplayLabel(user) : null}
      userEmail={user?.email}
    >
      {children}
    </ModuleShell>
  );
}
