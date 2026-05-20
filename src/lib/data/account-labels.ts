export type AccountStage =
  | "prospect"
  | "qualified"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type AccountSource =
  | "referral"
  | "inbound"
  | "outbound"
  | "event"
  | "partner";

export const STAGE_LABELS: Record<AccountStage, string> = {
  prospect: "Prospect",
  qualified: "Qualified",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export const SOURCE_LABELS: Record<string, string> = {
  referral: "Referral",
  inbound: "Inbound",
  outbound: "Outbound",
  event: "Event",
  partner: "Partner",
};

export const CATEGORY_OPTIONS = [
  "Consumer Goods",
  "Transportation",
  "Food & Beverage",
  "Industrial",
  "Healthcare",
  "Financial Services",
  "Technology",
  "Other",
] as const;
