import { SOURCE_LABELS } from "@/lib/data/account-labels";

export function formatAccountDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
