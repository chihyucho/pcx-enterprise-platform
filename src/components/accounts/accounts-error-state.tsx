import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountsErrorStateProps {
  message: string;
}

export function AccountsErrorState({ message }: AccountsErrorStateProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Accounts</h2>
        <p className="text-sm text-muted-foreground">
          Manage sales accounts and pipeline stages.
        </p>
      </div>
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-base">Unable to load accounts</CardTitle>
          </div>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {message.includes("permission denied") ? (
            <p className="text-sm text-muted-foreground">
              Apply RLS policies from{" "}
              <code className="text-xs">
                supabase/migrations/20260520120000_sales_rls_and_seed.sql
              </code>{" "}
              (policies only — no seed data). Run in the Supabase SQL Editor,
              then refresh.
            </p>
          ) : null}
          <Button variant="outline" asChild>
            <Link href="/sales-system/accounts">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
