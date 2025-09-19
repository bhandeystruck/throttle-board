export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      flight_requests: {
        Row: {
          id: string
          submitted_at: string
          status: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined'
          requester_handle: string
          platform: 'tiktok' | 'instagram' | 'youtube' | 'other' | null
          origin_icao: string
          origin_city: string
          destination_icao: string
          destination_city: string
          airline: string | null
          aircraft: string | null
          sim: string
          notes_public: string | null
          notes_private: string | null
          eta: string | null
          priority: number
          visibility: 'public' | 'unlisted' | 'private'
          published_at: string | null
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          submitted_at?: string
          status?: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined'
          requester_handle: string
          platform?: 'tiktok' | 'instagram' | 'youtube' | 'other' | null
          origin_icao: string
          origin_city: string
          destination_icao: string
          destination_city: string
          airline?: string | null
          aircraft?: string | null
          sim?: string
          notes_public?: string | null
          notes_private?: string | null
          eta?: string | null
          priority?: number
          visibility?: 'public' | 'unlisted' | 'private'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          submitted_at?: string
          status?: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined'
          requester_handle?: string
          platform?: 'tiktok' | 'instagram' | 'youtube' | 'other' | null
          origin_icao?: string
          origin_city?: string
          destination_icao?: string
          destination_city?: string
          airline?: string | null
          aircraft?: string | null
          sim?: string
          notes_public?: string | null
          notes_private?: string | null
          eta?: string | null
          priority?: number
          visibility?: 'public' | 'unlisted' | 'private'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      media_links: {
        Row: {
          id: string
          flight_request_id: string
          platform: 'tiktok' | 'instagram' | 'youtube' | 'other'
          url: string
          title: string | null
          thumbnail_url: string | null
          published_at: string
          created_at: string
        }
        Insert: {
          id?: string
          flight_request_id: string
          platform: 'tiktok' | 'instagram' | 'youtube' | 'other'
          url: string
          title?: string | null
          thumbnail_url?: string | null
          published_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          flight_request_id?: string
          platform?: 'tiktok' | 'instagram' | 'youtube' | 'other'
          url?: string
          title?: string | null
          thumbnail_url?: string | null
          published_at?: string
          created_at?: string
        }
      }
      status_events: {
        Row: {
          id: string
          flight_request_id: string
          from_status: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined' | null
          to_status: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined'
          changed_at: string
          comment: string | null
          changed_by: string
          user_id: string | null
        }
        Insert: {
          id?: string
          flight_request_id: string
          from_status?: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined' | null
          to_status: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined'
          changed_at?: string
          comment?: string | null
          changed_by: string
          user_id?: string | null
        }
        Update: {
          id?: string
          flight_request_id?: string
          from_status?: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined' | null
          to_status?: 'requested' | 'queued' | 'planning' | 'underway' | 'edited' | 'published' | 'archived' | 'declined'
          changed_at?: string
          comment?: string | null
          changed_by?: string
          user_id?: string | null
        }
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
