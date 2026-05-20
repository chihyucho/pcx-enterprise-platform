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

function normalizeStageKey(stageName: string): string {
  return stageName.toLowerCase().replace(/\s+/g, "_");
}

export function stageBadgeVariant(
  stageName: string
): "default" | "secondary" | "success" | "warning" | "muted" {
  switch (normalizeStageKey(stageName)) {
    case "closed_won":
      return "success";
    case "negotiation":
      return "warning";
    case "closed_lost":
      return "muted";
    default:
      return "secondary";
  }
}
