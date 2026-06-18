import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";

interface TopNavbarProps {
  title?: string;
  userEmail?: string | null;
  showPortalLink?: boolean;
}

export function TopNavbar({
  title = "PCX Enterprise Platform",
  userEmail,
  showPortalLink = true,
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex flex-1 items-center gap-4">
        {showPortalLink ? (
          <Link
            href="/portal"
            className="text-sm font-semibold tracking-tight text-foreground hover:text-foreground/80"
          >
            PCX
          </Link>
        ) : null}
        <span className="hidden text-muted-foreground sm:inline">/</span>
        <h1 className="truncate text-sm font-medium text-muted-foreground">
          {title}
        </h1>
      </div>
      <UserMenu userEmail={userEmail} showPortalLink={showPortalLink} />
    </header>
  );
}
