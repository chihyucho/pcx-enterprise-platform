import { createClient } from "@/lib/supabase/server";
import { ModuleShell } from "@/components/layout/module-shell";
import { SALES_NAV_ITEMS } from "@/lib/navigation/sales-nav";

export default async function SalesSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ModuleShell
      navItems={SALES_NAV_ITEMS}
      pageTitle="Sales System"
      moduleTitle="Sales System"
      userEmail={user?.email}
    >
      {children}
    </ModuleShell>
  );
}
