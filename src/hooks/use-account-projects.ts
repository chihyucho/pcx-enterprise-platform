"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAccountProjects } from "@/lib/accounts/tab-client";
import {
  filterRowsByProject,
  sortProjectsByCreatedAt,
  type AccountProjectRow,
} from "@/lib/accounts/project-utils";

export function useAccountProjects(accountId: string, enabled: boolean) {
  const [projects, setProjects] = useState<AccountProjectRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterProjectId, setFilterProjectId] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAccountProjects(accountId);
    if (result.error) {
      setProjects([]);
      setError(result.error);
      setLoading(false);
      return;
    }
    setProjects(sortProjectsByCreatedAt(result.data ?? []));
    setLoading(false);
  }, [accountId]);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [enabled, load]);

  const showProjectFilter = projects.length > 1;
  const showProjectOnCreate = projects.length > 0;

  const defaultCreateProjectId =
    filterProjectId !== "all" ? filterProjectId : (projects[0]?.id ?? null);

  function filterRows<T extends { project_id?: string | null }>(rows: T[]): T[] {
    return filterRowsByProject(rows, filterProjectId);
  }

  return {
    projects,
    projectsLoading: loading,
    projectsError: error,
    reloadProjects: load,
    filterProjectId,
    setFilterProjectId,
    showProjectFilter,
    showProjectOnCreate,
    defaultCreateProjectId,
    filterRows,
  };
}
