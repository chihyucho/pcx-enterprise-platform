import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-4 w-4" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Account</p>
              <p className="text-xs text-muted-foreground">
                {userEmail ?? "Signed in"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {showPortalLink ? (
            <DropdownMenuItem asChild>
              <Link href="/portal">Portal</Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={signOut} className="w-full">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center text-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
