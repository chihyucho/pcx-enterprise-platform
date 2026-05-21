"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAccountTabCrud } from "@/hooks/use-account-tab-crud";
import { CRUD_TAB_COLUMNS } from "@/lib/schema/tab-columns";
import type { AccountCrudTableName } from "@/types/tab-crud";
import { AccountDataTable } from "@/components/accounts/detail/account-data-table";
import { CreateRecordDialog } from "@/components/accounts/detail/create-record-dialog";
import { AccountTabPanel } from "@/components/accounts/detail/account-tab-panel";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AccountTabCrudProps {
  accountId: string;
  table: AccountCrudTableName;
  title: string;
  enabled: boolean;
}

export function AccountTabCrud({
  accountId,
  table,
  title,
  enabled,
}: AccountTabCrudProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { rows, error, loading, submitting, reload, create, formFields } =
    useAccountTabCrud(table, accountId, enabled);

  const columns = CRUD_TAB_COLUMNS[table];
  const tableRows = rows as unknown as Record<string, unknown>[];

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Data from <code className="text-xs">{table}</code> for this
              account
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : error ? (
          <AccountTabPanel
            title={title}
            loading={false}
            error={error}
            onRetry={reload}
          >
            {null}
          </AccountTabPanel>
        ) : (
          <AccountDataTable
            columns={columns}
            rows={tableRows}
            emptyMessage="No records yet."
          />
        )}
      </div>

      <CreateRecordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        tableName={table}
        accountId={accountId}
        fields={formFields}
        submitting={submitting}
        onSubmit={create}
      />
    </>
  );
}
