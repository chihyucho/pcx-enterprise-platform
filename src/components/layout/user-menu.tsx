"use client";

import Link from "next/link";
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
  userName?: string | null;
  userEmail?: string | null;
}

export function UserMenu({ userName, userEmail }: UserMenuProps) {
  const displayName = userName?.trim() || userEmail?.trim() || "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Open user menu"
        >
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[100] w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {userEmail ? (
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            const form = document.getElementById(
              "user-menu-sign-out-form"
            ) as HTMLFormElement | null;
            form?.requestSubmit();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
      <form id="user-menu-sign-out-form" action={signOut} className="hidden" />
    </DropdownMenu>
  );
}
