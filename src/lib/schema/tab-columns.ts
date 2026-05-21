import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type { AccountCrudTableName } from "@/types/tab-crud";

export interface TabColumnDef {
  key: string;
  label: string;
}

export const TAB_COLUMNS: Record<AccountTabTableName, TabColumnDef[]> = {
  account_projects: [
    { key: "launch_date", label: "Launch Date" },
    { key: "annual_volume", label: "Annual Volume" },
    { key: "forecast", label: "Forecast" },
    { key: "retail_price_range", label: "Retail Price Range" },
    { key: "distribution_plan", label: "Distribution Plan" },
    { key: "manufacturing_venues", label: "Manufacturing Venues" },
    { key: "technical_requirement", label: "Technical Requirement" },
    { key: "marketing_request", label: "Marketing Request" },
    { key: "created_at", label: "Created" },
    { key: "updated_at", label: "Updated" },
  ],
  sales_activities: [
    { key: "subject", label: "Subject" },
    { key: "activity_date", label: "Activity Date" },
    { key: "contact_way", label: "Contact Way" },
    { key: "next_follow_up", label: "Next Follow-up" },
    { key: "notes", label: "Notes" },
    { key: "created_at", label: "Created" },
  ],
  contacts: [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "created_at", label: "Created" },
  ],
  products: [
    { key: "product_number", label: "Product Number" },
    { key: "product_category", label: "Category" },
    { key: "approval_status", label: "Approval Status" },
    { key: "approved_at", label: "Approved At" },
    { key: "image_url", label: "Image URL" },
    { key: "created_at", label: "Created" },
  ],
  quotes: [
    { key: "style", label: "Style" },
    { key: "compound", label: "Compound" },
    { key: "price", label: "Price" },
    { key: "currency", label: "Currency" },
    { key: "quote_date", label: "Quote Date" },
    { key: "created_by", label: "Created By" },
  ],
  marketing_materials: [
    { key: "title", label: "Title" },
    { key: "file_url", label: "File URL" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created" },
  ],
  supply_chain: [
    { key: "factory_name", label: "Factory Name" },
    { key: "location", label: "Location" },
    { key: "notes", label: "Notes" },
    { key: "created_at", label: "Created" },
  ],
};

export const CRUD_TAB_COLUMNS: Record<AccountCrudTableName, TabColumnDef[]> = {
  ...TAB_COLUMNS,
  contact_persons: [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "primary_contact", label: "Primary" },
    { key: "created_at", label: "Created" },
  ],
};

export const BRAND_OVERVIEW_FIELDS: TabColumnDef[] = [
  { key: "brand_name", label: "Brand Name" },
  { key: "category_name", label: "Business Category" },
  { key: "stage_name", label: "Stage" },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created" },
  { key: "updated_at", label: "Updated" },
];
