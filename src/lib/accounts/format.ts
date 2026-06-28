import { SOURCE_LABELS } from "@/lib/data/account-labels";

export function formatAccountDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Local calendar date as `YYYY-MM-DD` for `<input type="date">`. */
export function todayDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatSourceLabel(source: string): string {
  const normalized = source
    .toLowerCase()
    .replace(/\s+/g, "_") as keyof typeof SOURCE_LABELS;
  return SOURCE_LABELS[normalized] ?? source;
}

/**
 * Badge styling from the stage name in `public.stages.stage_name`.
 * Does not assume fixed stage labels — works with your Supabase data.
 */
export function stageBadgeVariant(
  stageName: string
): "default" | "secondary" | "success" | "warning" | "muted" {
  const name = stageName.toLowerCase();

  if (name.includes("won") || name.includes("closed win")) {
    return "success";
  }
  if (name.includes("lost") || name.includes("closed loss")) {
    return "muted";
  }
  if (name.includes("negotiat")) {
    return "warning";
  }

  return "secondary";
}
