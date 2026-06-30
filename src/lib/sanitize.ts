import type { AccountCrudTableName } from "@/types/tab-crud";

/** Shared string / numeric bounds for enterprise input hardening. */
export const INPUT_LIMITS = {
  shortText: 200,
  mediumText: 500,
  longText: 8_000,
  url: 2_048,
  currency: 16,
  date: 32,
  priceMax: 999_999_999.99,
  priceMin: -999_999_999.99,
} as const;

const LONG_TEXT_FIELD_NAMES = new Set([
  "notes",
  "description",
  "distribution_plan",
  "technical_requirement",
  "marketing_request",
  "corporate_background_company_history",
  "company_address",
  "social_media",
  "distribution",
  "competitors",
  "financials",
]);

const URL_FIELD_NAMES = new Set(["linkedin", "image_url", "file_url", "brand_website"]);

const MEDIUM_TEXT_FIELD_NAMES = new Set([
  "subject",
  "name",
  "project_name",
  "factory_name",
  "location",
  "title",
  "parent_company_or_ownership",
]);

const DATE_FIELD_NAMES = new Set([
  "activity_date",
  "quote_date",
  "launch_date",
  "approved_at",
]);

/** Mirrors Zod limits in tab.schemas.ts for server-side sanitization. */
export function getTabFieldMaxLength(
  _table: AccountCrudTableName,
  fieldName: string
): number {
  if (fieldName === "currency") return INPUT_LIMITS.currency;
  if (URL_FIELD_NAMES.has(fieldName)) return INPUT_LIMITS.url;
  if (DATE_FIELD_NAMES.has(fieldName) || fieldName.endsWith("_date")) {
    return INPUT_LIMITS.date;
  }
  if (LONG_TEXT_FIELD_NAMES.has(fieldName)) return INPUT_LIMITS.longText;
  if (MEDIUM_TEXT_FIELD_NAMES.has(fieldName)) return INPUT_LIMITS.mediumText;
  return INPUT_LIMITS.shortText;
}

export function sanitizeTabWriteValues<T extends AccountCrudTableName>(
  table: T,
  values: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    out[key] = sanitizePlainText(value ?? "", getTabFieldMaxLength(table, key));
  }
  return out;
}

export function sanitizeBrandOverviewValues(
  values: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    out[key] = sanitizePlainText(value ?? "", getBrandOverviewFieldMaxLength(key));
  }
  return out;
}

function getBrandOverviewFieldMaxLength(fieldName: string): number {
  if (URL_FIELD_NAMES.has(fieldName)) return INPUT_LIMITS.url;
  if (LONG_TEXT_FIELD_NAMES.has(fieldName)) return INPUT_LIMITS.longText;
  if (MEDIUM_TEXT_FIELD_NAMES.has(fieldName)) return INPUT_LIMITS.mediumText;
  return INPUT_LIMITS.shortText;
}

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SCRIPT_TAG = /<\s*\/?\s*script\b[^>]*>/gi;

export function stripControlCharacters(value: string): string {
  return value.replace(CONTROL_CHARS, "");
}

/** Basic XSS hardening for plain-text fields (not for rich HTML). */
export function stripScriptTags(value: string): string {
  return value.replace(SCRIPT_TAG, "");
}

export function sanitizePlainText(
  value: string,
  maxLength: number
): string {
  return stripScriptTags(stripControlCharacters(value)).trim().slice(0, maxLength);
}

export function sanitizeOptionalText(
  value: string | null | undefined,
  maxLength: number
): string | null {
  if (value == null) return null;
  const sanitized = sanitizePlainText(String(value), maxLength);
  return sanitized === "" ? null : sanitized;
}

/** @deprecated Use sanitizeTabWriteValues or sanitizeBrandOverviewValues */
export function sanitizeRecordValues(
  values: Record<string, string>,
  maxLength = INPUT_LIMITS.mediumText
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    out[key] = sanitizePlainText(value ?? "", maxLength);
  }
  return out;
}

export function parseBoundedNumber(
  raw: string,
  options?: { min?: number; max?: number }
): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return null;
  if (options?.min != null && num < options.min) return null;
  if (options?.max != null && num > options.max) return null;
  return num;
}

export function parseBooleanString(raw: string): boolean {
  return raw === "true";
}

export function parseOptionalUuid(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const value = raw.trim();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  ) {
    return null;
  }
  return value;
}
