import { z } from "zod";
import type { AccountCrudTableName } from "@/types/tab-crud";
import { INPUT_LIMITS } from "@/lib/sanitize";

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v?.trim()));

const requiredText = (max: number, label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(max)
    .transform((v) => v.trim());

const optionalDate = z
  .string()
  .max(32)
  .optional()
  .transform((v) => (v?.trim() === "" ? undefined : v?.trim()));

const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

const optionalPrice = z
  .string()
  .optional()
  .transform((v, ctx) => {
    if (!v?.trim()) return null;
    const num = Number(v);
    if (!Number.isFinite(num)) {
      ctx.addIssue({ code: "custom", message: "Price must be a valid number" });
      return z.NEVER;
    }
    if (num < INPUT_LIMITS.priceMin || num > INPUT_LIMITS.priceMax) {
      ctx.addIssue({ code: "custom", message: "Price is out of allowed range" });
      return z.NEVER;
    }
    return num;
  });

export const salesActivityWriteSchema = z.object({
  subject: requiredText(INPUT_LIMITS.mediumText, "Subject"),
  activity_date: requiredText(32, "Activity date"),
  contact_way: optionalText(INPUT_LIMITS.shortText),
  notes: optionalText(INPUT_LIMITS.longText),
  project_id: optionalUuid,
});

export const contactPersonWriteSchema = z.object({
  name: requiredText(INPUT_LIMITS.mediumText, "Name"),
  title: optionalText(INPUT_LIMITS.shortText),
  email: optionalText(INPUT_LIMITS.shortText),
  phone: optionalText(INPUT_LIMITS.shortText),
  linkedin: optionalText(INPUT_LIMITS.url),
  primary_contact: z.enum(["true", "false"]).optional(),
  notes: optionalText(INPUT_LIMITS.longText),
  project_id: optionalUuid,
});

export const productWriteSchema = z.object({
  product_number: optionalText(INPUT_LIMITS.shortText),
  product_category: optionalText(INPUT_LIMITS.shortText),
  approval_status: optionalText(INPUT_LIMITS.shortText),
  approved_at: optionalDate,
  image_url: optionalText(INPUT_LIMITS.url),
  project_id: optionalUuid,
});

export const quoteWriteSchema = z.object({
  style: optionalText(INPUT_LIMITS.shortText),
  compound: optionalText(INPUT_LIMITS.shortText),
  price: optionalPrice,
  currency: optionalText(INPUT_LIMITS.currency),
  quote_date: optionalDate,
  notes: optionalText(INPUT_LIMITS.longText),
  project_id: optionalUuid,
});

export const marketingMaterialWriteSchema = z.object({
  title: requiredText(INPUT_LIMITS.mediumText, "Title"),
  channel: optionalText(INPUT_LIMITS.shortText),
  description: optionalText(INPUT_LIMITS.longText),
  file_url: optionalText(INPUT_LIMITS.url),
  status: optionalText(INPUT_LIMITS.shortText),
  approved_at: optionalDate,
  project_id: optionalUuid,
});

export const supplyChainWriteSchema = z.object({
  factory_name: optionalText(INPUT_LIMITS.mediumText),
  location: optionalText(INPUT_LIMITS.mediumText),
  notes: optionalText(INPUT_LIMITS.longText),
  project_id: optionalUuid,
});

export const accountProjectWriteSchema = z.object({
  project_name: requiredText(INPUT_LIMITS.mediumText, "Project name"),
  launch_date: optionalDate,
  annual_volume: optionalText(INPUT_LIMITS.shortText),
  forecast: optionalText(INPUT_LIMITS.shortText),
  retail_price_range: optionalText(INPUT_LIMITS.shortText),
  distribution_plan: optionalText(INPUT_LIMITS.longText),
  manufacturing_venues: optionalText(INPUT_LIMITS.shortText),
  technical_requirement: optionalText(INPUT_LIMITS.longText),
  marketing_request: optionalText(INPUT_LIMITS.longText),
});

const TAB_WRITE_SCHEMAS = {
  sales_activities: salesActivityWriteSchema,
  contact_persons: contactPersonWriteSchema,
  products: productWriteSchema,
  quotes: quoteWriteSchema,
  marketing_materials: marketingMaterialWriteSchema,
  supply_chain: supplyChainWriteSchema,
  account_projects: accountProjectWriteSchema,
} as const satisfies Record<AccountCrudTableName, z.ZodTypeAny>;

export type TabWriteInput<T extends AccountCrudTableName> = z.infer<
  (typeof TAB_WRITE_SCHEMAS)[T]
>;

export function validateTabWrite<T extends AccountCrudTableName>(
  table: T,
  values: Record<string, string>
):
  | { success: true; data: TabWriteInput<T> }
  | { success: false; error: string } {
  const schema = TAB_WRITE_SCHEMAS[table];
  const result = schema.safeParse(values);
  if (!result.success) {
    const first = result.error.issues[0];
    return {
      success: false,
      error: first?.message ?? "Invalid input",
    };
  }
  return { success: true, data: result.data as TabWriteInput<T> };
}

export function getTabWriteSchema<T extends AccountCrudTableName>(
  table: T
): (typeof TAB_WRITE_SCHEMAS)[T] {
  return TAB_WRITE_SCHEMAS[table];
}
