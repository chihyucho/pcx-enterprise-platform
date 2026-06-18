import type { AccountCrudTableName } from "@/types/tab-crud";
import {
  CONTACT_WAY_OPTIONS,
  MARKETING_APPROVAL_STATUS_OPTIONS,
  PRODUCT_APPROVAL_STATUS_OPTIONS,
  type FieldOption,
} from "@/lib/schema/field-options";

export type FormFieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "boolean"
  | "select";

export interface TabFormFieldDef {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: readonly FieldOption[];
}

export const TAB_FORM_FIELDS: Record<AccountCrudTableName, TabFormFieldDef[]> = {
  sales_activities: [
    { name: "subject", label: "Subject", type: "text", required: true },
    { name: "activity_date", label: "Activity Date", type: "date" },
    {
      name: "contact_way",
      label: "Contact Way",
      type: "select",
      options: CONTACT_WAY_OPTIONS,
    },
    { name: "next_follow_up", label: "Next Follow-up", type: "date" },
    {
      name: "follow_up_completed",
      label: "Follow-up completed",
      type: "boolean",
    },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  contact_persons: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "title", label: "Title", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "linkedin", label: "LinkedIn", type: "text" },
    { name: "primary_contact", label: "Primary Contact", type: "boolean" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  products: [
    { name: "product_number", label: "Product Number", type: "text" },
    { name: "product_category", label: "Category", type: "text" },
    {
      name: "approval_status",
      label: "Approval Status",
      type: "select",
      options: PRODUCT_APPROVAL_STATUS_OPTIONS,
    },
    { name: "approved_at", label: "Approved At", type: "date" },
    { name: "image_url", label: "Image URL", type: "text" },
  ],
  quotes: [
    { name: "style", label: "Style", type: "text" },
    { name: "compound", label: "Compound", type: "text" },
    { name: "price", label: "Price", type: "number" },
    { name: "currency", label: "Currency", type: "text" },
    { name: "quote_date", label: "Quote Date", type: "date" },
    { name: "notes", label: "Note", type: "textarea" },
  ],
  marketing_materials: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "channel", label: "Channel", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "file_url", label: "File URL", type: "text" },
    {
      name: "status",
      label: "Approval Status",
      type: "select",
      options: MARKETING_APPROVAL_STATUS_OPTIONS,
    },
    { name: "approved_at", label: "Approved At", type: "date" },
  ],
  supply_chain: [
    { name: "factory_name", label: "Factory Name", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  account_projects: [
    { name: "project_name", label: "Project Name", type: "text", required: true },
    { name: "launch_date", label: "Launch Date", type: "date" },
    { name: "annual_volume", label: "Annual Volume", type: "text" },
    { name: "forecast", label: "Forecast", type: "text" },
    { name: "retail_price_range", label: "Retail Price Range", type: "text" },
    { name: "distribution_plan", label: "Distribution Plan", type: "textarea" },
    { name: "manufacturing_venues", label: "Manufacturing Venues", type: "text" },
    { name: "technical_requirement", label: "Technical Requirement", type: "textarea" },
    { name: "marketing_request", label: "Marketing Request", type: "textarea" },
  ],
};

/** Editable fields for `brand_overview` (excludes id, account_id, timestamps). */
export const BRAND_OVERVIEW_FORM_FIELDS: TabFormFieldDef[] = [
  {
    name: "parent_company_or_ownership",
    label: "Parent Company / Ownership",
    type: "text",
  },
  {
    name: "corporate_background_company_history",
    label: "Corporate Background & History",
    type: "textarea",
  },
  { name: "brand_website", label: "Brand Website", type: "text" },
  { name: "company_address", label: "Company Address", type: "textarea" },
  { name: "social_media", label: "Social Media", type: "textarea" },
  { name: "territories", label: "Territories", type: "text" },
  { name: "distribution", label: "Distribution", type: "textarea" },
  { name: "competitors", label: "Competitors", type: "textarea" },
  { name: "financials", label: "Financials", type: "textarea" },
];
