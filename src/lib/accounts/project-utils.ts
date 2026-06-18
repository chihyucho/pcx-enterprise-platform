import type { Tables } from "@/types/database.types";

export type AccountProjectRow = Tables<"account_projects">;

export const PROJECT_SCOPED_TABLES = [
  "sales_activities",
  "products",
  "quotes",
  "marketing_materials",
  "supply_chain",
] as const;

export type ProjectScopedTableName = (typeof PROJECT_SCOPED_TABLES)[number];

export function isProjectScopedTable(
  table: string
): table is ProjectScopedTableName {
  return (PROJECT_SCOPED_TABLES as readonly string[]).includes(table);
}

export function projectLabel(project: AccountProjectRow): string {
  const name = project.project_name?.trim();
  if (name) return name;
  if (project.created_at) {
    return `Project · ${new Date(project.created_at).toLocaleDateString()}`;
  }
  return "Untitled project";
}

export function sortProjectsByCreatedAt(
  projects: AccountProjectRow[]
): AccountProjectRow[] {
  return [...projects].sort((a, b) => {
    const aTime = a.created_at
      ? Date.parse(a.created_at)
      : Number.MAX_SAFE_INTEGER;
    const bTime = b.created_at
      ? Date.parse(b.created_at)
      : Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
}

export function resolveProjectName(
  projectId: string | null | undefined,
  projects: AccountProjectRow[]
): string {
  if (!projectId) return "—";
  const project = projects.find((p) => p.id === projectId);
  return project ? projectLabel(project) : "—";
}

export function filterRowsByProject<T extends { project_id?: string | null }>(
  rows: T[],
  filterProjectId: string
): T[] {
  if (filterProjectId === "all") return rows;
  return rows.filter((row) => row.project_id === filterProjectId);
}

export function enrichRowsWithProjectName<
  T extends { project_id?: string | null },
>(
  rows: T[],
  projects: AccountProjectRow[]
): (T & { project_name: string })[] {
  return rows.map((row) => ({
    ...row,
    project_name: resolveProjectName(row.project_id, projects),
  }));
}
