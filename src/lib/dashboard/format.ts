import { PRODUCT_APPROVAL_STATUS_OPTIONS } from "@/lib/schema/field-options";

const STATUS_LABELS = Object.fromEntries(
  PRODUCT_APPROVAL_STATUS_OPTIONS.map((o) => [o.value, o.label])
);

export function formatApprovalStatusLabel(status: string): string {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "_");
  return STATUS_LABELS[normalized] ?? status;
}

export function accountDetailHref(
  accountId: string,
  tab?: string
): string {
  const base = `/sales-system/accounts/${accountId}`;
  return tab ? `${base}?tab=${encodeURIComponent(tab)}` : base;
}
