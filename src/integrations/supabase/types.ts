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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          name: string
          procedure_id: string
          type: string
          uploaded_at: string
          url: string
        }
        Insert: {
          id?: string
          name: string
          procedure_id: string
          type: string
          uploaded_at?: string
          url: string
        }
        Update: {
          id?: string
          name?: string
          procedure_id?: string
          type?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string
          id: string
          message: string
          recipient: string
          sent_at: string
          status: string
          type: string
        }
        Insert: {
          channel: string
          id?: string
          message: string
          recipient: string
          sent_at?: string
          status?: string
          type: string
        }
        Update: {
          channel?: string
          id?: string
          message?: string
          recipient?: string
          sent_at?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      owners: {
        Row: {
          address: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          id_number: string
          id_type: string
          last_name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          id_number: string
          id_type: string
          last_name: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          id_number?: string
          id_type?: string
          last_name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          administrative_fees: number | null
          amount: number
          created_at: string
          currency: string
          days_impounded: number | null
          id: string
          kkiapay_token: string | null
          kkiapay_transaction_id: string | null
          owner_id: string
          payment_date: string | null
          payment_method: string | null
          penalty_fees: number | null
          receipt_generated_at: string | null
          receipt_number: string | null
          receipt_url: string | null
          status: string
          storage_fees: number | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          administrative_fees?: number | null
          amount: number
          created_at?: string
          currency?: string
          days_impounded?: number | null
          id?: string
          kkiapay_token?: string | null
          kkiapay_transaction_id?: string | null
          owner_id: string
          payment_date?: string | null
          payment_method?: string | null
          penalty_fees?: number | null
          receipt_generated_at?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          status?: string
          storage_fees?: number | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          administrative_fees?: number | null
          amount?: number
          created_at?: string
          currency?: string
          days_impounded?: number | null
          id?: string
          kkiapay_token?: string | null
          kkiapay_transaction_id?: string | null
          owner_id?: string
          payment_date?: string | null
          payment_method?: string | null
          penalty_fees?: number | null
          receipt_generated_at?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          status?: string
          storage_fees?: number | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          owner_id: string
          payment_date: string
          payment_method: string
          receipt_url: string | null
          reference: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          owner_id: string
          payment_date?: string
          payment_method: string
          receipt_url?: string | null
          reference: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          owner_id?: string
          payment_date?: string
          payment_method?: string
          receipt_url?: string | null
          reference?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          created_at: string
          created_by: string
          fees_calculated: number
          id: string
          status: string
          type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          fees_calculated?: number
          id?: string
          status?: string
          type: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          fees_calculated?: number
          id?: string
          status?: string
          type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedures_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_active: boolean
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id: string
          is_active?: boolean
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string
          created_at: string
          description: string | null
          estimated_value: number
          id: string
          impound_date: string
          license_plate: string
          location: string
          make: string
          model: string
          owner_id: string | null
          photos: string[] | null
          qr_code: string | null
          status: string
          type: string
          updated_at: string
          year: number
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          estimated_value?: number
          id?: string
          impound_date?: string
          license_plate: string
          location: string
          make: string
          model: string
          owner_id?: string | null
          photos?: string[] | null
          qr_code?: string | null
          status?: string
          type: string
          updated_at?: string
          year: number
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          estimated_value?: number
          id?: string
          impound_date?: string
          license_plate?: string
          location?: string
          make?: string
          model?: string
          owner_id?: string | null
          photos?: string[] | null
          qr_code?: string | null
          status?: string
          type?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
