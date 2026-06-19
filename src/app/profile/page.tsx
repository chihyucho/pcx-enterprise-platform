import { redirect } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";
import { MainContent } from "@/components/layout/main-content";
import { ProfileForm } from "@/components/profile/profile-form";
import { getUserDisplayInfo, userDisplayLabel } from "@/lib/auth/user";

export default async function ProfilePage() {
  const user = await getUserDisplayInfo();

  if (!user) {
    redirect("/login?redirectTo=/profile");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar
        title="Profile"
        userName={userDisplayLabel(user)}
        userEmail={user.email}
      />
      <MainContent>
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              User profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your personal information and account security.
            </p>
          </div>
          <ProfileForm
            fullName={user.fullName ?? ""}
            email={user.email}
          />
        </div>
      </MainContent>
    </div>
  );
}
