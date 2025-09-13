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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      birth_charts: {
        Row: {
          astrological_system: string
          birth_city_id: string | null
          birth_date: string
          birth_latitude: number | null
          birth_longitude: number | null
          birth_time: string | null
          chart_data: Json
          chart_name: string
          chart_type: string
          created_at: string
          id: string
          is_public: boolean | null
          metadata: Json | null
          tenant_id: string
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          astrological_system?: string
          birth_city_id?: string | null
          birth_date: string
          birth_latitude?: number | null
          birth_longitude?: number | null
          birth_time?: string | null
          chart_data?: Json
          chart_name: string
          chart_type?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          tenant_id: string
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          astrological_system?: string
          birth_city_id?: string | null
          birth_date?: string
          birth_latitude?: number | null
          birth_longitude?: number | null
          birth_time?: string | null
          chart_data?: Json
          chart_name?: string
          chart_type?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          tenant_id?: string
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "birth_charts_birth_city_id_fkey"
            columns: ["birth_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "birth_charts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_interpretations: {
        Row: {
          ai_model: string
          chart_id: string
          confidence_score: number | null
          created_at: string
          feedback_rating: number | null
          feedback_text: string | null
          generated_at: string
          id: string
          interpretation_text: string
          interpretation_type: string
          tenant_id: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          ai_model?: string
          chart_id: string
          confidence_score?: number | null
          created_at?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          generated_at?: string
          id?: string
          interpretation_text: string
          interpretation_type: string
          tenant_id: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          ai_model?: string
          chart_id?: string
          confidence_score?: number | null
          created_at?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          generated_at?: string
          id?: string
          interpretation_text?: string
          interpretation_type?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_interpretations_chart_id_fkey"
            columns: ["chart_id"]
            isOneToOne: false
            referencedRelation: "birth_charts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chart_interpretations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_shares: {
        Row: {
          access_count: number | null
          chart_id: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_accessed_at: string | null
          permissions: Json | null
          share_token: string
          share_type: string
          shared_by_user_id: string
          shared_with_user_id: string | null
          updated_at: string
        }
        Insert: {
          access_count?: number | null
          chart_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed_at?: string | null
          permissions?: Json | null
          share_token?: string
          share_type?: string
          shared_by_user_id: string
          shared_with_user_id?: string | null
          updated_at?: string
        }
        Update: {
          access_count?: number | null
          chart_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed_at?: string | null
          permissions?: Json | null
          share_token?: string
          share_type?: string
          shared_by_user_id?: string
          shared_with_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_shares_chart_id_fkey"
            columns: ["chart_id"]
            isOneToOne: false
            referencedRelation: "birth_charts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          context_data: Json | null
          conversation_title: string | null
          created_at: string
          id: string
          is_active: boolean | null
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          conversation_title?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          conversation_title?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          ai_model: string | null
          confidence_score: number | null
          context_used: Json | null
          conversation_id: string
          created_at: string
          id: string
          message_content: string
          sender_type: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          ai_model?: string | null
          confidence_score?: number | null
          context_used?: Json | null
          conversation_id: string
          created_at?: string
          id?: string
          message_content: string
          sender_type: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          ai_model?: string | null
          confidence_score?: number | null
          context_used?: Json | null
          conversation_id?: string
          created_at?: string
          id?: string
          message_content?: string
          sender_type?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          population: number | null
          state_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          population?: number | null
          state_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          population?: number | null
          state_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      continents: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          continent_id: string | null
          created_at: string | null
          currency_code: string | null
          id: string
          iso_code: string
          name: string
          timezone_offset: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          continent_id?: string | null
          created_at?: string | null
          currency_code?: string | null
          id?: string
          iso_code: string
          name: string
          timezone_offset?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          continent_id?: string | null
          created_at?: string | null
          currency_code?: string | null
          id?: string
          iso_code?: string
          name?: string
          timezone_offset?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "countries_continent_id_fkey"
            columns: ["continent_id"]
            isOneToOne: false
            referencedRelation: "continents"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          city_id: string | null
          contact_email: string | null
          contact_phone: string | null
          country_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_organization_id: string | null
          settings: Json | null
          state_id: string | null
          tenant_id: string | null
          type: Database["public"]["Enums"]["organization_type"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_organization_id?: string | null
          settings?: Json | null
          state_id?: string | null
          tenant_id?: string | null
          type?: Database["public"]["Enums"]["organization_type"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_organization_id?: string | null
          settings?: Json | null
          state_id?: string | null
          tenant_id?: string | null
          type?: Database["public"]["Enums"]["organization_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_parent_organization_id_fkey"
            columns: ["parent_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      planetary_positions: {
        Row: {
          chart_id: string
          created_at: string
          house_number: number | null
          id: string
          is_retrograde: boolean | null
          latitude: number | null
          longitude: number
          planet_name: string
          sign_degrees: number
          sign_name: string
          speed: number | null
        }
        Insert: {
          chart_id: string
          created_at?: string
          house_number?: number | null
          id?: string
          is_retrograde?: boolean | null
          latitude?: number | null
          longitude: number
          planet_name: string
          sign_degrees: number
          sign_name: string
          speed?: number | null
        }
        Update: {
          chart_id?: string
          created_at?: string
          house_number?: number | null
          id?: string
          is_retrograde?: boolean | null
          latitude?: number | null
          longitude?: number
          planet_name?: string
          sign_degrees?: number
          sign_name?: string
          speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "planetary_positions_chart_id_fkey"
            columns: ["chart_id"]
            isOneToOne: false
            referencedRelation: "birth_charts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_city_id: string | null
          birth_date: string | null
          birth_time: string | null
          city_id: string | null
          country_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string | null
          metadata: Json | null
          organization_id: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          state_id: string | null
          tenant_id: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_city_id?: string | null
          birth_date?: string | null
          birth_time?: string | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state_id?: string | null
          tenant_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_city_id?: string | null
          birth_date?: string | null
          birth_time?: string | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state_id?: string | null
          tenant_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_birth_city_id_fkey"
            columns: ["birth_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          actions: string[]
          conditions: Json | null
          created_at: string | null
          id: string
          resource: string
          role: Database["public"]["Enums"]["user_role"] | null
          tenant_id: string | null
        }
        Insert: {
          actions: string[]
          conditions?: Json | null
          created_at?: string | null
          id?: string
          resource: string
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
        }
        Update: {
          actions?: string[]
          conditions?: Json | null
          created_at?: string | null
          id?: string
          resource?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          code: string
          country_id: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          country_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          country_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "states_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address: string | null
          billing_config: Json | null
          branding_config: Json | null
          city_id: string | null
          contact_email: string | null
          contact_phone: string | null
          country_id: string | null
          created_at: string | null
          domain: string | null
          feature_config: Json | null
          id: string
          max_organizations: number | null
          max_users: number | null
          name: string
          slug: string
          status: Database["public"]["Enums"]["tenant_status"] | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          billing_config?: Json | null
          branding_config?: Json | null
          city_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string | null
          domain?: string | null
          feature_config?: Json | null
          id?: string
          max_organizations?: number | null
          max_users?: number | null
          name: string
          slug: string
          status?: Database["public"]["Enums"]["tenant_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          billing_config?: Json | null
          branding_config?: Json | null
          city_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string | null
          domain?: string | null
          feature_config?: Json | null
          id?: string
          max_organizations?: number | null
          max_users?: number | null
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["tenant_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          location: Json | null
          session_token: string
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          location?: Json | null
          session_token: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          location?: Json | null
          session_token?: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_current_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_permission: {
        Args: { action: string; resource: string }
        Returns: boolean
      }
    }
    Enums: {
      organization_type: "headquarters" | "franchise" | "branch" | "partner"
      subscription_tier: "basic" | "professional" | "enterprise" | "custom"
      tenant_status: "active" | "suspended" | "inactive" | "trial"
      user_role:
        | "super_admin"
        | "tenant_admin"
        | "organization_admin"
        | "franchise_admin"
        | "manager"
        | "customer"
        | "end_user"
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
    Enums: {
      organization_type: ["headquarters", "franchise", "branch", "partner"],
      subscription_tier: ["basic", "professional", "enterprise", "custom"],
      tenant_status: ["active", "suspended", "inactive", "trial"],
      user_role: [
        "super_admin",
        "tenant_admin",
        "organization_admin",
        "franchise_admin",
        "manager",
        "customer",
        "end_user",
      ],
    },
  },
} as const
