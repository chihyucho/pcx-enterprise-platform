import Link from "next/link";
import { getAccountFormOptions } from "@/lib/accounts/form-options";
import { CreateAccountForm } from "@/components/forms/create-account-form";
import { Button } from "@/components/ui/button";

export default async function NewAccountPage() {
  const options = await getAccountFormOptions();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">
          <Link href="/sales-system/accounts" className="hover:underline">
            Accounts
          </Link>
          <span className="mx-2">/</span>
          <span>New account</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Create New Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Add a new sales account to the pipeline.
        </p>
      </div>

      {options.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {options.error}
          <p className="mt-2 text-muted-foreground">
            Stages and categories are loaded from your{" "}
            <code className="text-xs">stages</code> and{" "}
            <code className="text-xs">business_categories</code> tables. If you
            see permission denied, apply the RLS section of{" "}
            <code className="text-xs">
              supabase/migrations/20260520120000_sales_rls_and_seed.sql
            </code>
            .
          </p>
        </div>
      ) : null}

      <CreateAccountForm
        categories={options.categories}
        stages={options.stages}
      />

      <Button variant="ghost" asChild>
        <Link href="/sales-system/accounts">Back to accounts</Link>
      </Button>
    </div>
  );
}
