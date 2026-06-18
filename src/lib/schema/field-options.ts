/** Dropdown options for account detail form fields. */

export const CONTACT_WAY_OPTIONS = [
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
  { value: "Video Call", label: "Video Call" },
  { value: "In Person", label: "In Person" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Trade Show", label: "Trade Show" },
  { value: "Other", label: "Other" },
] as const;

/**
 * Allowed values for `products.approval_status` (PostgreSQL CHECK constraint
 * `products_approval_status_check` on table public.products).
 * Values must match exactly — use lowercase snake_case.
 */
export const PRODUCT_APPROVAL_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "on_hold", label: "On Hold" },
] as const;

/**
 * Same allowed values as products — stored in `marketing_materials.status`
 * (CHECK `marketing_materials_status_check`).
 */
export const MARKETING_APPROVAL_STATUS_OPTIONS = PRODUCT_APPROVAL_STATUS_OPTIONS;

export type FieldOption = { value: string; label: string };

export function mergeSelectOptions(
  options: readonly FieldOption[],
  currentValue: string | undefined
): FieldOption[] {
  const trimmed = currentValue?.trim();
  if (!trimmed) return [...options];
  if (options.some((o) => o.value === trimmed)) return [...options];
  return [{ value: trimmed, label: `${trimmed} (current)` }, ...options];
}
