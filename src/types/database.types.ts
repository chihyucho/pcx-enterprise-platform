export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_projects: {
        Row: {
          account_id: string | null
          annual_volume: string | null
          created_at: string | null
          distribution_plan: string | null
          forecast: string | null
          id: string
          launch_date: string | null
          manufacturing_venues: string | null
          marketing_request: string | null
          retail_price_range: string | null
          technical_requirement: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          annual_volume?: string | null
          created_at?: string | null
          distribution_plan?: string | null
          forecast?: string | null
          id?: string
          launch_date?: string | null
          manufacturing_venues?: string | null
          marketing_request?: string | null
          retail_price_range?: string | null
          technical_requirement?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          annual_volume?: string | null
          created_at?: string | null
          distribution_plan?: string | null
          forecast?: string | null
          id?: string
          launch_date?: string | null
          manufacturing_venues?: string | null
          marketing_request?: string | null
          retail_price_range?: string | null
          technical_requirement?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_projects_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          brand_name: string
          business_category_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          source: string | null
          stage_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brand_name: string
          business_category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          source?: string | null
          stage_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_name?: string
          business_category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          source?: string | null
          stage_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_business_category_id_fkey"
            columns: ["business_category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
      business_categories: {
        Row: {
          category_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          category_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          category_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      contact_persons: {
        Row: {
          account_id: string | null
          created_at: string | null
          email: string | null
          id: string
          linkedin: string | null
          name: string
          notes: string | null
          phone: string | null
          primary_contact: boolean | null
          title: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          linkedin?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          primary_contact?: boolean | null
          title?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          linkedin?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          primary_contact?: boolean | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_persons_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          account_id: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          title: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          title?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_materials: {
        Row: {
          account_id: string | null
          created_at: string | null
          file_url: string | null
          id: string
          status: string | null
          title: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          title?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_materials_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          account_id: string | null
          approval_status: string | null
          approved_at: string | null
          created_at: string | null
          id: string
          image_url: string | null
          product_category: string | null
          product_number: string | null
        }
        Insert: {
          account_id?: string | null
          approval_status?: string | null
          approved_at?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          product_category?: string | null
          product_number?: string | null
        }
        Update: {
          account_id?: string | null
          approval_status?: string | null
          approved_at?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          product_category?: string | null
          product_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          account_id: string | null
          compound: string | null
          created_by: string | null
          currency: string | null
          id: string
          price: number | null
          quote_date: string | null
          style: string | null
        }
        Insert: {
          account_id?: string | null
          compound?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          price?: number | null
          quote_date?: string | null
          style?: string | null
        }
        Update: {
          account_id?: string | null
          compound?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          price?: number | null
          quote_date?: string | null
          style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_activities: {
        Row: {
          account_id: string | null
          activity_date: string | null
          contact_person_id: string | null
          contact_way: string | null
          created_at: string | null
          created_by: string | null
          id: string
          next_follow_up: string | null
          notes: string | null
          subject: string | null
        }
        Insert: {
          account_id?: string | null
          activity_date?: string | null
          contact_person_id?: string | null
          contact_way?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          next_follow_up?: string | null
          notes?: string | null
          subject?: string | null
        }
        Update: {
          account_id?: string | null
          activity_date?: string | null
          contact_person_id?: string | null
          contact_way?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          next_follow_up?: string | null
          notes?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_activities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_activities_contact_person_id_fkey"
            columns: ["contact_person_id"]
            isOneToOne: false
            referencedRelation: "contact_persons"
            referencedColumns: ["id"]
          },
        ]
      }
      stages: {
        Row: {
          created_at: string | null
          id: string
          order_index: number | null
          stage_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_index?: number | null
          stage_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_index?: number | null
          stage_name?: string
        }
        Relationships: []
      }
      supply_chain: {
        Row: {
          account_id: string | null
          created_at: string | null
          factory_name: string | null
          id: string
          location: string | null
          notes: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          factory_name?: string | null
          id?: string
          location?: string | null
          notes?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          factory_name?: string | null
          id?: string
          location?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
