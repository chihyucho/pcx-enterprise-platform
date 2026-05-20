import { z } from "zod";

export const createAccountSchema = z.object({
  brand: z.string().min(1, "Brand name is required"),
  category: z.string().min(1, "Business category is required"),
  stage: z.enum([
    "prospect",
    "qualified",
    "negotiation",
    "closed_won",
    "closed_lost",
  ]),
  source: z.enum(["referral", "inbound", "outbound", "event", "partner"]),
});

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;
