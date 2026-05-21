import type { AccountCrudTableName } from "@/types/tab-crud";

export type FormFieldType = "text" | "textarea" | "date" | "number" | "boolean";

export interface TabFormFieldDef {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
}

export const TAB_FORM_FIELDS: Record<AccountCrudTableName, TabFormFieldDef[]> = {
  sales_activities: [
    { name: "subject", label: "Subject", type: "text", required: true },
    { name: "activity_date", label: "Activity Date", type: "date" },
    { name: "contact_way", label: "Contact Way", type: "text" },
    { name: "next_follow_up", label: "Next Follow-up", type: "date" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  contacts: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "title", label: "Title", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
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
    { name: "approval_status", label: "Approval Status", type: "text" },
    { name: "image_url", label: "Image URL", type: "text" },
  ],
  quotes: [
    { name: "style", label: "Style", type: "text" },
    { name: "compound", label: "Compound", type: "text" },
    { name: "price", label: "Price", type: "number" },
    { name: "currency", label: "Currency", type: "text" },
    { name: "quote_date", label: "Quote Date", type: "date" },
  ],
  marketing_materials: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "file_url", label: "File URL", type: "text" },
    { name: "status", label: "Status", type: "text" },
  ],
  supply_chain: [
    { name: "factory_name", label: "Factory Name", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  account_projects: [
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
