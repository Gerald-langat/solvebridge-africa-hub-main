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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bounties: {
        Row: {
          awarded_to: string | null
          created_at: string
          created_by: string
          criteria: string | null
          currency: string | null
          deadline: string | null
          description: string
          id: string
          reward_amount: number | null
          status: string | null
          submissions_count: number | null
          tags: string[] | null
          target_regions: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          awarded_to?: string | null
          created_at?: string
          created_by: string
          criteria?: string | null
          currency?: string | null
          deadline?: string | null
          description: string
          id?: string
          reward_amount?: number | null
          status?: string | null
          submissions_count?: number | null
          tags?: string[] | null
          target_regions?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          awarded_to?: string | null
          created_at?: string
          created_by?: string
          criteria?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string
          id?: string
          reward_amount?: number | null
          status?: string | null
          submissions_count?: number | null
          tags?: string[] | null
          target_regions?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaborations: {
        Row: {
          created_at: string
          id: string
          problem_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          problem_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          problem_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "validated_problems_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          participants: string[]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          participants: string[]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          participants?: string[]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discussion_posts: {
        Row: {
          body: string
          category: string
          created_at: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          body: string
          category: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_value: number | null
          deadline: string | null
          id: string
          target_value: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          id?: string
          target_value: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          id?: string
          target_value?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      innovation_challenges: {
        Row: {
          created_at: string | null
          currency: string | null
          deadline: string | null
          description: string
          id: string
          partner_id: string
          reward_amount: number | null
          status: string | null
          target_category: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          description: string
          id?: string
          partner_id: string
          reward_amount?: number | null
          status?: string | null
          target_category?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string
          id?: string
          partner_id?: string
          reward_amount?: number | null
          status?: string | null
          target_category?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "innovation_challenges_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          file_url: string | null
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          achieved_at: string
          description: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          achieved_at?: string
          description?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          achieved_at?: string
          description?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          access_level: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          access_level?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          access_level?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      problems: {
        Row: {
          affected_population: string | null
          created_at: string
          current_workaround: string | null
          description: string
          duplicate_of: string | null
          id: string
          image_url: string | null
          impact_scale: string | null
          location: string
          moderated_at: string | null
          moderated_by: string | null
          moderator_notes: string | null
          open_to_collaborate: boolean | null
          sector: Database["public"]["Enums"]["problem_sector"]
          severity: number | null
          stakeholders: string | null
          status: Database["public"]["Enums"]["problem_status"]
          submitter_id: string
          suggested_solution: string | null
          summary: string | null
          tags: string[] | null
          target_audience: string | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          affected_population?: string | null
          created_at?: string
          current_workaround?: string | null
          description: string
          duplicate_of?: string | null
          id?: string
          image_url?: string | null
          impact_scale?: string | null
          location: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderator_notes?: string | null
          open_to_collaborate?: boolean | null
          sector: Database["public"]["Enums"]["problem_sector"]
          severity?: number | null
          stakeholders?: string | null
          status?: Database["public"]["Enums"]["problem_status"]
          submitter_id: string
          suggested_solution?: string | null
          summary?: string | null
          tags?: string[] | null
          target_audience?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          affected_population?: string | null
          created_at?: string
          current_workaround?: string | null
          description?: string
          duplicate_of?: string | null
          id?: string
          image_url?: string | null
          impact_scale?: string | null
          location?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderator_notes?: string | null
          open_to_collaborate?: boolean | null
          sector?: Database["public"]["Enums"]["problem_sector"]
          severity?: number | null
          stakeholders?: string | null
          status?: Database["public"]["Enums"]["problem_status"]
          submitter_id?: string
          suggested_solution?: string | null
          summary?: string | null
          tags?: string[] | null
          target_audience?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "validated_problems_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_submitter_id_fkey"
            columns: ["submitter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          location: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          location?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          location?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          joined_at: string
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          approach: string | null
          budget_allocated: number | null
          budget_spent: number | null
          concept_document_url: string | null
          created_at: string
          created_by: string
          currency: string | null
          deadline: string | null
          description: string | null
          estimated_cost: number | null
          feasibility_level: string | null
          id: string
          jobs_created: number | null
          key_benefits: string[] | null
          people_impacted: number | null
          priority: string | null
          problem_id: string | null
          progress_percentage: number | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string
          value_proposition: string | null
        }
        Insert: {
          approach?: string | null
          budget_allocated?: number | null
          budget_spent?: number | null
          concept_document_url?: string | null
          created_at?: string
          created_by: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          estimated_cost?: number | null
          feasibility_level?: string | null
          id?: string
          jobs_created?: number | null
          key_benefits?: string[] | null
          people_impacted?: number | null
          priority?: string | null
          problem_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          value_proposition?: string | null
        }
        Update: {
          approach?: string | null
          budget_allocated?: number | null
          budget_spent?: number | null
          concept_document_url?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          estimated_cost?: number | null
          feasibility_level?: string | null
          id?: string
          jobs_created?: number | null
          key_benefits?: string[] | null
          people_impacted?: number | null
          priority?: string | null
          problem_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          value_proposition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "validated_problems_public"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_problems: {
        Row: {
          created_at: string
          id: string
          problem_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          problem_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          problem_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_problems_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_problems_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "validated_problems_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_problems_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      validated_problems_public: {
        Row: {
          affected_population: string | null
          created_at: string | null
          current_workaround: string | null
          description: string | null
          id: string | null
          image_url: string | null
          location: string | null
          open_to_collaborate: boolean | null
          sector: Database["public"]["Enums"]["problem_sector"] | null
          severity: number | null
          status: Database["public"]["Enums"]["problem_status"] | null
          suggested_solution: string | null
          title: string | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          affected_population?: string | null
          created_at?: string | null
          current_workaround?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          open_to_collaborate?: boolean | null
          sector?: Database["public"]["Enums"]["problem_sector"] | null
          severity?: number | null
          status?: Database["public"]["Enums"]["problem_status"] | null
          suggested_solution?: string | null
          title?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          affected_population?: string | null
          created_at?: string | null
          current_workaround?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          open_to_collaborate?: boolean | null
          sector?: Database["public"]["Enums"]["problem_sector"] | null
          severity?: number | null
          status?: Database["public"]["Enums"]["problem_status"] | null
          suggested_solution?: string | null
          title?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "moderator"
        | "program_manager"
        | "partner"
        | "community_ambassador"
        | "read_only_viewer"
        | "problem_submitter"
        | "innovator"
        | "mentor"
      collaboration_mode: "virtual" | "in_person" | "both"
      priority_level: "low" | "medium" | "high"
      problem_sector:
        | "health"
        | "education"
        | "agriculture"
        | "energy"
        | "tech"
        | "finance"
        | "transport"
        | "water"
        | "housing"
        | "other"
      problem_status: "pending" | "validated" | "in_collaboration" | "declined"
      user_role: "problem_submitter" | "innovator" | "mentor"
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
      app_role: [
        "super_admin",
        "moderator",
        "program_manager",
        "partner",
        "community_ambassador",
        "read_only_viewer",
        "problem_submitter",
        "innovator",
        "mentor",
      ],
      collaboration_mode: ["virtual", "in_person", "both"],
      priority_level: ["low", "medium", "high"],
      problem_sector: [
        "health",
        "education",
        "agriculture",
        "energy",
        "tech",
        "finance",
        "transport",
        "water",
        "housing",
        "other",
      ],
      problem_status: ["pending", "validated", "in_collaboration", "declined"],
      user_role: ["problem_submitter", "innovator", "mentor"],
    },
  },
} as const
