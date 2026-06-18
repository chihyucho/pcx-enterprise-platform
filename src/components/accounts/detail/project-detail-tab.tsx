"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAccountTabCrud } from "@/hooks/use-account-tab-crud";
import { PROJECT_DETAIL_FIELDS } from "@/lib/schema/tab-columns";
import { AccountDataTable } from "@/components/accounts/detail/account-data-table";
import { CreateRecordDialog } from "@/components/accounts/detail/create-record-dialog";
import { AccountTabPanel } from "@/components/accounts/detail/account-tab-panel";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/types/database.types";

type AccountProjectRow = Tables<"account_projects">;

function projectLabel(project: AccountProjectRow): string {
  const name = project.project_name?.trim();
  if (name) return name;
  if (project.created_at) {
    return `Project · ${new Date(project.created_at).toLocaleDateString()}`;
  }
  return "Untitled project";
}

function sortByCreatedAt(projects: AccountProjectRow[]): AccountProjectRow[] {
  return [...projects].sort((a, b) => {
    const aTime = a.created_at ? Date.parse(a.created_at) : Number.MAX_SAFE_INTEGER;
    const bTime = b.created_at ? Date.parse(b.created_at) : Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
}

interface ProjectDetailTabProps {
  accountId: string;
  title: string;
  enabled: boolean;
}

export function ProjectDetailTab({
  accountId,
  title,
  enabled,
}: ProjectDetailTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { rows, error, loading, submitting, reload, create, formFields } =
    useAccountTabCrud("account_projects", accountId, enabled);

  const sortedProjects = useMemo(
    () => sortByCreatedAt(rows as AccountProjectRow[]),
    [rows]
  );

  useEffect(() => {
    if (sortedProjects.length === 0) {
      setSelectedProjectId(null);
      return;
    }

    const stillExists = sortedProjects.some((p) => p.id === selectedProjectId);
    if (!selectedProjectId || !stillExists) {
      setSelectedProjectId(sortedProjects[0].id);
    }
  }, [sortedProjects, selectedProjectId]);

  const selectedProject = sortedProjects.find((p) => p.id === selectedProjectId);
  const displayRows = selectedProject
    ? [selectedProject as unknown as Record<string, unknown>]
    : [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Data from <code className="text-xs">account_projects</code> for this
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
        ) : sortedProjects.length === 0 ? (
          <div className="rounded-lg border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            No records yet.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedProjects.length > 1 ? (
              <div className="max-w-md space-y-2">
                <label
                  htmlFor="project-selector"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Select project
                </label>
                <Select
                  value={selectedProjectId ?? undefined}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger id="project-selector" className="bg-card">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {projectLabel(project)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <AccountDataTable
              columns={PROJECT_DETAIL_FIELDS}
              rows={displayRows}
              vertical
              verticalLabelClassName="w-[9.5rem] sm:w-[11rem]"
              verticalValueClassName="text-foreground"
              multilineKeys={[
                "distribution_plan",
                "technical_requirement",
                "marketing_request",
                "manufacturing_venues",
              ]}
              emptyMessage="No records yet."
            />
          </div>
        )}
      </div>

      <CreateRecordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        tableName="account_projects"
        accountId={accountId}
        fields={formFields}
        submitting={submitting}
        onSubmit={create}
      />
    </>
  );
}
