import { TopNavbar } from "@/components/layout/top-navbar";
import { MainContent } from "@/components/layout/main-content";
import { ModuleCard } from "@/components/portal/module-card";
import { getUserDisplayInfo, userDisplayLabel } from "@/lib/auth/user";
import { PORTAL_MODULES } from "@/lib/navigation/portal-modules";

export default async function PortalPage() {
  const user = await getUserDisplayInfo();

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar
        title="Portal"
        userName={user ? userDisplayLabel(user) : null}
        userEmail={user?.email}
        showPortalLink={false}
      />
      <MainContent>
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Select a system to get started.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PORTAL_MODULES.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </MainContent>
    </div>
  );
}
