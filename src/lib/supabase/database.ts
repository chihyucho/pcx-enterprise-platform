import type { Database } from "@/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type { Database } from "@/types/database.types";
export type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;
