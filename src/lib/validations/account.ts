import { z } from "zod";

const uuid = z.string().uuid("Please select a valid option");

export const createAccountSchema = z.object({
  brandName: z.string().min(1, "Brand name is required").max(200),
  businessCategoryId: uuid,
  stageId: uuid,
  source: z.string().min(1, "Source is required").max(100),
  status: z.string().max(50).optional(),
});

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = createAccountSchema.extend({
  accountId: z.string().uuid("Invalid account id"),
});

export type UpdateAccountFormValues = z.infer<typeof updateAccountSchema>;
