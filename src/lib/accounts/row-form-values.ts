import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";

export function rowToFormValues(
  row: Record<string, unknown>,
  fields: TabFormFieldDef[],
  options?: { includeProjectId?: boolean }
): Record<string, string> {
  const entries = fields.map((field) => {
    const raw = row[field.name];
    if (typeof raw === "boolean") {
      return [field.name, raw ? "true" : "false"];
    }
    if (raw == null) {
      return [field.name, ""];
    }
    if (field.type === "date" && typeof raw === "string") {
      return [field.name, raw.slice(0, 10)];
    }
    return [field.name, String(raw)];
  });

  if (options?.includeProjectId && row.project_id != null) {
    entries.push(["project_id", String(row.project_id)]);
  }

  return Object.fromEntries(entries);
}

export function emptyFormValues(
  fields: TabFormFieldDef[]
): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [f.name, f.type === "boolean" ? "false" : ""])
  );
}
