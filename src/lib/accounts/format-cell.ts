import { formatAccountDate } from "@/lib/accounts/format";

const DATE_KEYS = new Set([
  "created_at",
  "updated_at",
  "activity_date",
  "next_follow_up",
  "approved_at",
  "quote_date",
  "launch_date",
]);

const URL_KEYS = new Set(["file_url", "image_url", "linkedin"]);

export function formatCellValue(
  key: string,
  value: unknown
): string {
  if (value == null || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    if (DATE_KEYS.has(key)) {
      try {
        return formatAccountDate(value);
      } catch {
        return value;
      }
    }
    return value;
  }

  return String(value);
}

export function isUrlColumn(key: string): boolean {
  return URL_KEYS.has(key);
}
