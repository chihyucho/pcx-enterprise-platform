"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAccountTabCrud } from "@/hooks/use-account-tab-crud";
import { useAccountProjects } from "@/hooks/use-account-projects";
import {
  CRUD_TAB_COLUMNS,
  columnsWithProject,
} from "@/lib/schema/tab-columns";
import {
  enrichRowsWithProjectName,
  isProjectScopedTable,
} from "@/lib/accounts/project-utils";
import {
  getMultilineKeysForTable,
  getRecordDetailTitle,
  isDeletableAccountTabTable,
} from "@/lib/accounts/record-detail";
import type { AccountCrudTableName } from "@/types/tab-crud";
import type { Tables } from "@/types/database.types";
import { AccountDataTable } from "@/components/accounts/detail/account-data-table";
import { CreateRecordDialog } from "@/components/accounts/detail/create-record-dialog";
import { RecordDetailDialog } from "@/components/accounts/detail/record-detail-dialog";
import { ProjectFilterSelect } from "@/components/accounts/detail/project-filter-select";
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
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Tables<typeof table> | null>(
    null
  );

  const projectScoped = isProjectScopedTable(table);
  const { rows, error, loading, submitting, reload, create, update, remove, formFields } =
    useAccountTabCrud(table, accountId, enabled);
  const canDelete = isDeletableAccountTabTable(table);
  const {
    projects,
    filterProjectId,
    setFilterProjectId,
    showProjectFilter,
    showProjectOnCreate,
    defaultCreateProjectId,
    filterRows,
  } = useAccountProjects(accountId, enabled && projectScoped);

  const columns = useMemo(
    () =>
      columnsWithProject(
        CRUD_TAB_COLUMNS[table],
        projectScoped && showProjectOnCreate
      ),
    [table, projectScoped, showProjectOnCreate]
  );

  const detailColumns = useMemo(
    () => columnsWithProject(CRUD_TAB_COLUMNS[table], projectScoped && showProjectOnCreate),
    [table, projectScoped, showProjectOnCreate]
  );

  const filteredRows = useMemo(() => {
    const scoped = projectScoped
      ? filterRows(rows as { project_id?: string | null }[])
      : rows;
    if (!projectScoped || !showProjectOnCreate) {
      return scoped as unknown as Record<string, unknown>[];
    }
    return enrichRowsWithProjectName(
      scoped as { project_id?: string | null }[],
      projects
    ) as unknown as Record<string, unknown>[];
  }, [rows, projectScoped, filterRows, showProjectOnCreate, projects]);

  const selectedDisplayRow = useMemo(() => {
    if (!selectedRow) return null;
    const base = selectedRow as unknown as Record<string, unknown>;
    if (!projectScoped || !showProjectOnCreate) {
      return base;
    }
    return enrichRowsWithProjectName(
      [selectedRow as { project_id?: string | null }],
      projects
    )[0] as unknown as Record<string, unknown>;
  }, [selectedRow, projectScoped, showProjectOnCreate, projects]);

  useEffect(() => {
    if (!detailOpen || !selectedRow) return;
    const refreshed = rows.find((row) => row.id === selectedRow.id);
    if (refreshed) {
      setSelectedRow(refreshed);
    }
  }, [rows, selectedRow, detailOpen]);

  function openDetail(row: Record<string, unknown>) {
    const id = row.id as string;
    const original = rows.find((r) => r.id === id);
    setSelectedRow((original ?? row) as Tables<typeof table>);
    setDetailOpen(true);
  }

  async function handleUpdate(values: Record<string, string>) {
    if (!selectedRow) {
      return { success: false, error: "No record selected." };
    }
    return update(selectedRow.id, values);
  }

  async function handleDelete() {
    if (!selectedRow) {
      return { success: false, error: "No record selected." };
    }
    const result = await remove(selectedRow.id);
    if (result.success) {
      setDetailOpen(false);
      setSelectedRow(null);
    }
    return result;
  }

  const detailTitle = selectedRow
    ? getRecordDetailTitle(table, selectedRow as unknown as Record<string, unknown>)
    : title;

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Data from <code className="text-xs">{table}</code> for this
              account. Click a row to view details.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>

        {projectScoped && showProjectFilter ? (
          <ProjectFilterSelect
            projects={projects}
            value={filterProjectId}
            onValueChange={setFilterProjectId}
          />
        ) : null}

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
            rows={filteredRows}
            emptyMessage="No records yet."
            onRowClick={openDetail}
          />
        )}
      </div>

      <CreateRecordDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={title}
        tableName={table}
        accountId={accountId}
        fields={formFields}
        submitting={submitting}
        onSubmit={create}
        projects={projectScoped ? projects : []}
        defaultProjectId={projectScoped ? defaultCreateProjectId : null}
      />

      {selectedDisplayRow ? (
        <RecordDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title={detailTitle}
          subtitle={`${title} details`}
          row={selectedDisplayRow}
          viewColumns={detailColumns}
          fields={formFields}
          submitting={submitting}
          onSubmit={handleUpdate}
          onDelete={canDelete ? handleDelete : undefined}
          multilineKeys={getMultilineKeysForTable(table)}
          projects={projectScoped ? projects : []}
        />
      ) : null}
    </>
  );
}
