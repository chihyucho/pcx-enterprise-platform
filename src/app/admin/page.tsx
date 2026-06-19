import Link from "next/link";
import { TopNavbar } from "@/components/layout/top-navbar";
import { MainContent } from "@/components/layout/main-content";
import { getUserDisplayInfo, userDisplayLabel } from "@/lib/auth/user";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const user = await getUserDisplayInfo();

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar
        title="Admin"
        userName={user ? userDisplayLabel(user) : null}
        userEmail={user?.email}
      />
      <MainContent>
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Admin</h2>
          <p className="text-sm text-muted-foreground">
            Platform administration is not available yet.
          </p>
          <Button variant="outline" asChild>
            <Link href="/portal">Back to Portal</Link>
          </Button>
        </div>
      </MainContent>
    </div>
  );
}
