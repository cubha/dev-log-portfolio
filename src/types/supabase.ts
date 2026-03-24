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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          description: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      about_profiles: {
        Row: {
          created_at: string | null
          id: string
          intro_text: string
          is_intro_visible: boolean
          main_copy: string
          profile_image_url: string | null
          show_education: boolean
          show_experience: boolean
          show_training: boolean
          story_json: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          intro_text: string
          is_intro_visible?: boolean
          main_copy: string
          profile_image_url?: string | null
          show_education?: boolean
          show_experience?: boolean
          show_training?: boolean
          story_json?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          intro_text?: string
          is_intro_visible?: boolean
          main_copy?: string
          profile_image_url?: string | null
          show_education?: boolean
          show_experience?: boolean
          show_training?: boolean
          story_json?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_links: {
        Row: {
          created_at: string | null
          href: string | null
          icon_key: string
          id: string
          is_copyable: boolean
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string | null
          href?: string | null
          icon_key: string
          id?: string
          is_copyable?: boolean
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string | null
          href?: string | null
          icon_key?: string
          id?: string
          is_copyable?: boolean
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      educations: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: number
          major: string
          school_name: string
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          major: string
          school_name: string
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          major?: string
          school_name?: string
          start_date?: string
          status?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company_name: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: number
          is_current: boolean
          position: string
          start_date: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          is_current?: boolean
          position: string
          start_date: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          is_current?: boolean
          position?: string
          start_date?: string
        }
        Relationships: []
      }
      guestbook: {
        Row: {
          avatar_url: string | null
          created_at: string
          emoji: string
          id: number
          is_secret: boolean
          message: string
          nickname: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          emoji?: string
          id?: number
          is_secret?: boolean
          message: string
          nickname: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          emoji?: string
          id?: number
          is_secret?: boolean
          message?: string
          nickname?: string
          user_id?: string | null
        }
        Relationships: []
      }
      guestbook_comments: {
        Row: {
          avatar_url: string | null
          created_at: string
          guestbook_id: number
          id: number
          message: string
          nickname: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          guestbook_id: number
          id?: number
          message: string
          nickname: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          guestbook_id?: number
          id?: number
          message?: string
          nickname?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guestbook_comments_guestbook_id_fkey"
            columns: ["guestbook_id"]
            isOneToOne: false
            referencedRelation: "guestbook"
            referencedColumns: ["id"]
          }
        ]
      }
      guestbook_likes: {
        Row: {
          id: number
          guestbook_id: number
          user_id: string
          created_at: string
        }
        Insert: {
          id?: number
          guestbook_id: number
          user_id: string
          created_at?: string
        }
        Update: {
          id?: number
          guestbook_id?: number
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guestbook_likes_guestbook_id_fkey"
            columns: ["guestbook_id"]
            isOneToOne: false
            referencedRelation: "guestbook"
            referencedColumns: ["id"]
          }
        ]
      }
      guestbook_comment_likes: {
        Row: {
          comment_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guestbook_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "guestbook_comments"
            referencedColumns: ["id"]
          }
        ]
      }
      inquiries: {
        Row: {
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          password: string
          password_hash: string
          replied_at: string | null
          reply: string | null
          reply_is_public: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          password: string
          password_hash?: string
          replied_at?: string | null
          reply?: string | null
          reply_is_public?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          password?: string
          password_hash?: string
          replied_at?: string | null
          reply?: string | null
          reply_is_public?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          id: string
          introduction: string | null
          main_copy: string | null
          profile_image_url: string | null
          story_json: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          introduction?: string | null
          main_copy?: string | null
          profile_image_url?: string | null
          story_json?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          introduction?: string | null
          main_copy?: string | null
          profile_image_url?: string | null
          story_json?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          password: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          password?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          password?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          company_name: string | null
          created_at: string | null
          description: string | null
          detailed_tasks: string[] | null
          end_date: string | null
          github_url: string | null
          id: number
          is_featured: boolean | null
          is_ongoing: boolean | null
          link_url: string | null
          live_demo_url: string | null
          project_role: string | null
          project_type: 'work' | 'personal' | 'team' | null
          start_date: string | null
          team_size: number | null
          tech_stack: string[] | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          category?: string | null
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          detailed_tasks?: string[] | null
          end_date?: string | null
          github_url?: string | null
          id?: number
          is_featured?: boolean | null
          is_ongoing?: boolean | null
          link_url?: string | null
          live_demo_url?: string | null
          project_role?: string | null
          project_type?: 'work' | 'personal' | 'team' | null
          start_date?: string | null
          team_size?: number | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          category?: string | null
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          detailed_tasks?: string[] | null
          end_date?: string | null
          github_url?: string | null
          id?: number
          is_featured?: boolean | null
          is_ongoing?: boolean | null
          link_url?: string | null
          live_demo_url?: string | null
          project_role?: string | null
          project_type?: 'work' | 'personal' | 'team' | null
          start_date?: string | null
          team_size?: number | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: number
          path: string
          visitor_id: string | null
          created_at: string
        }
        Insert: {
          id?: number
          path: string
          visitor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          path?: string
          visitor_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          icon_name: string | null
          id: number
          name: string
          proficiency: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: number
          name: string
          proficiency?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: number
          name?: string
          proficiency?: number | null
        }
        Relationships: []
      }
      trainings: {
        Row: {
          acquired_date: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: number
          institution: string
          start_date: string | null
          title: string
          type: string
        }
        Insert: {
          acquired_date: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          institution: string
          start_date?: string | null
          title: string
          type?: string
        }
        Update: {
          acquired_date?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          institution?: string
          start_date?: string | null
          title?: string
          type?: string
        }
        Relationships: []
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
