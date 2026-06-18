"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
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

interface UserMenuProps {
  userEmail?: string | null;
  showPortalLink?: boolean;
}

function UserMenuButton() {
  return (
    <Button variant="ghost" size="icon" className="rounded-full">
      <User className="h-4 w-4" />
      <span className="sr-only">User menu</span>
    </Button>
  );
}

export function UserMenu({
  userEmail,
  showPortalLink = true,
}: UserMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <UserMenuButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserMenuButton />
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
  );
}
