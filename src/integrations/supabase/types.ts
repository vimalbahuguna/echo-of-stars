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
      academy_memberships: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["academy_role"]
          status: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          role: Database["public"]["Enums"]["academy_role"]
          status?: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["academy_role"]
          status?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      asm_assessment_results: {
        Row: {
          assessment_id: number
          created_at: string
          graded_at: string | null
          grader_faculty_id: number | null
          passed: boolean | null
          result_id: number
          score: number | null
          student_id: number
          updated_at: string
        }
        Insert: {
          assessment_id: number
          created_at?: string
          graded_at?: string | null
          grader_faculty_id?: number | null
          passed?: boolean | null
          result_id?: number
          score?: number | null
          student_id: number
          updated_at?: string
        }
        Update: {
          assessment_id?: number
          created_at?: string
          graded_at?: string | null
          grader_faculty_id?: number | null
          passed?: boolean | null
          result_id?: number
          score?: number | null
          student_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asm_assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "asm_assessments"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "asm_assessment_results_grader_faculty_id_fkey"
            columns: ["grader_faculty_id"]
            isOneToOne: false
            referencedRelation: "fac_faculty"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "asm_assessment_results_grader_faculty_id_fkey"
            columns: ["grader_faculty_id"]
            isOneToOne: false
            referencedRelation: "vw_faculty_week_load"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "asm_assessment_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "asm_assessment_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "asm_assessment_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "asm_assessment_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      asm_assessments: {
        Row: {
          assessment_id: number
          assessment_name: string
          assessment_type_id: number
          description: string | null
          duration_hours: number | null
          level_id: number
          max_marks: number | null
          quantity: number | null
        }
        Insert: {
          assessment_id?: number
          assessment_name: string
          assessment_type_id: number
          description?: string | null
          duration_hours?: number | null
          level_id: number
          max_marks?: number | null
          quantity?: number | null
        }
        Update: {
          assessment_id?: number
          assessment_name?: string
          assessment_type_id?: number
          description?: string | null
          duration_hours?: number | null
          level_id?: number
          max_marks?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "asm_assessments_assessment_type_id_fkey"
            columns: ["assessment_type_id"]
            isOneToOne: false
            referencedRelation: "asm_types"
            referencedColumns: ["assessment_type_id"]
          },
          {
            foreignKeyName: "asm_assessments_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "asm_assessments_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
        ]
      }
      asm_types: {
        Row: {
          assessment_type_id: number
          description: string | null
          type_name: string
        }
        Insert: {
          assessment_type_id?: number
          description?: string | null
          type_name: string
        }
        Update: {
          assessment_type_id?: number
          description?: string | null
          type_name?: string
        }
        Relationships: []
      }
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
      cert_certifications_awarded: {
        Row: {
          award_id: number
          awarded_at: string
          certificate_code: string | null
          created_at: string
          level_id: number
          notes: string | null
          status: Database["public"]["Enums"]["cert_status_enum"]
          student_id: number
          updated_at: string
        }
        Insert: {
          award_id?: number
          awarded_at?: string
          certificate_code?: string | null
          created_at?: string
          level_id: number
          notes?: string | null
          status?: Database["public"]["Enums"]["cert_status_enum"]
          student_id: number
          updated_at?: string
        }
        Update: {
          award_id?: number
          awarded_at?: string
          certificate_code?: string | null
          created_at?: string
          level_id?: number
          notes?: string | null
          status?: Database["public"]["Enums"]["cert_status_enum"]
          student_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cert_certifications_awarded_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "cert_certifications_awarded_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "cert_certifications_awarded_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "cert_certifications_awarded_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "cert_certifications_awarded_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "cert_certifications_awarded_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string | null
          course_id: string
          id: string
          issued_at: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          certificate_number?: string | null
          course_id: string
          id?: string
          issued_at?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          certificate_number?: string | null
          course_id?: string
          id?: string
          issued_at?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      com_announcements: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          expires_at: string | null
          id: string
          level_id: number | null
          priority: string | null
          published_at: string | null
          target_audience: string | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          level_id?: number | null
          priority?: string | null
          published_at?: string | null
          target_audience?: string | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          level_id?: number | null
          priority?: string | null
          published_at?: string | null
          target_audience?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "com_announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "com_announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "com_announcements_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "com_announcements_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "com_announcements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      com_forum_posts: {
        Row: {
          author_membership_id: string | null
          content: string
          created_at: string
          parent_post_id: number | null
          post_id: number
          topic_id: number
          updated_at: string
        }
        Insert: {
          author_membership_id?: string | null
          content: string
          created_at?: string
          parent_post_id?: number | null
          post_id?: number
          topic_id: number
          updated_at?: string
        }
        Update: {
          author_membership_id?: string | null
          content?: string
          created_at?: string
          parent_post_id?: number | null
          post_id?: number
          topic_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "com_forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "com_forum_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "com_forum_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "com_forum_topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      com_forum_topics: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          level_id: number | null
          title: string
          topic_id: number
          updated_at: string
          week_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          level_id?: number | null
          title: string
          topic_id?: number
          updated_at?: string
          week_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          level_id?: number | null
          title?: string
          topic_id?: number
          updated_at?: string
          week_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "com_forum_topics_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "com_forum_topics_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "com_forum_topics_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "com_forum_topics_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
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
      courses: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          language: string | null
          level: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          language?: string | null
          level?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language?: string | null
          level?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cur_assignments: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          max_points: number | null
          section_id: string | null
          title: string
          updated_at: string
          week_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          max_points?: number | null
          section_id?: string | null
          title: string
          updated_at?: string
          week_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          max_points?: number | null
          section_id?: string | null
          title?: string
          updated_at?: string
          week_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cur_assignments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "cur_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cur_assignments_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "cur_assignments_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      cur_certification_levels: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          duration_months: number
          duration_weeks: number
          fee_usd: number
          level_id: number
          level_name: string
          level_type: Database["public"]["Enums"]["cur_level_type_enum"]
          passing_score_percentage: number
          sequence_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          duration_months: number
          duration_weeks: number
          fee_usd: number
          level_id?: number
          level_name: string
          level_type: Database["public"]["Enums"]["cur_level_type_enum"]
          passing_score_percentage: number
          sequence_order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          duration_months?: number
          duration_weeks?: number
          fee_usd?: number
          level_id?: number
          level_name?: string
          level_type?: Database["public"]["Enums"]["cur_level_type_enum"]
          passing_score_percentage?: number
          sequence_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      cur_exercise_logs: {
        Row: {
          completed_at: string | null
          exercise_id: number
          log_id: number
          notes: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["stu_progress_status_enum"] | null
          student_id: number
        }
        Insert: {
          completed_at?: string | null
          exercise_id: number
          log_id?: number
          notes?: string | null
          started_at?: string | null
          status?:
            | Database["public"]["Enums"]["stu_progress_status_enum"]
            | null
          student_id: number
        }
        Update: {
          completed_at?: string | null
          exercise_id?: number
          log_id?: number
          notes?: string | null
          started_at?: string | null
          status?:
            | Database["public"]["Enums"]["stu_progress_status_enum"]
            | null
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cur_exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "cur_practical_exercises"
            referencedColumns: ["exercise_id"]
          },
          {
            foreignKeyName: "cur_exercise_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "cur_exercise_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "cur_exercise_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "cur_exercise_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      cur_level_requirements: {
        Row: {
          created_at: string
          level_id: number
          prerequisite: string | null
          required_hours: number | null
          requirement_id: number
          requirement_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          level_id: number
          prerequisite?: string | null
          required_hours?: number | null
          requirement_id?: number
          requirement_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          level_id?: number
          prerequisite?: string | null
          required_hours?: number | null
          requirement_id?: number
          requirement_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cur_level_requirements_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "cur_level_requirements_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
        ]
      }
      cur_months: {
        Row: {
          description: string | null
          level_id: number
          month_id: number
          month_number: number
          month_title: string
        }
        Insert: {
          description?: string | null
          level_id: number
          month_id?: number
          month_number: number
          month_title: string
        }
        Update: {
          description?: string | null
          level_id?: number
          month_id?: number
          month_number?: number
          month_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cur_months_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "cur_months_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
        ]
      }
      cur_practical_exercises: {
        Row: {
          difficulty_level: Database["public"]["Enums"]["cur_difficulty_level_enum"]
          estimated_duration_hours: number | null
          exercise_description: string | null
          exercise_id: number
          exercise_order: number
          exercise_title: string
          week_id: number
        }
        Insert: {
          difficulty_level: Database["public"]["Enums"]["cur_difficulty_level_enum"]
          estimated_duration_hours?: number | null
          exercise_description?: string | null
          exercise_id?: number
          exercise_order: number
          exercise_title: string
          week_id: number
        }
        Update: {
          difficulty_level?: Database["public"]["Enums"]["cur_difficulty_level_enum"]
          estimated_duration_hours?: number | null
          exercise_description?: string | null
          exercise_id?: number
          exercise_order?: number
          exercise_title?: string
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cur_practical_exercises_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "cur_practical_exercises_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      cur_reading_materials: {
        Row: {
          added_at: string | null
          kind: string | null
          material_id: number
          title: string
          url: string | null
          week_id: number
        }
        Insert: {
          added_at?: string | null
          kind?: string | null
          material_id?: number
          title: string
          url?: string | null
          week_id: number
        }
        Update: {
          added_at?: string | null
          kind?: string | null
          material_id?: number
          title?: string
          url?: string | null
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cur_reading_materials_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "cur_reading_materials_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      cur_sections: {
        Row: {
          capacity: number | null
          code: string
          created_at: string
          faculty_id: number | null
          id: string
          level_id: number | null
          name: string
          schedule: string | null
          status: string | null
          updated_at: string
          week_id: number | null
        }
        Insert: {
          capacity?: number | null
          code: string
          created_at?: string
          faculty_id?: number | null
          id?: string
          level_id?: number | null
          name: string
          schedule?: string | null
          status?: string | null
          updated_at?: string
          week_id?: number | null
        }
        Update: {
          capacity?: number | null
          code?: string
          created_at?: string
          faculty_id?: number | null
          id?: string
          level_id?: number | null
          name?: string
          schedule?: string | null
          status?: string | null
          updated_at?: string
          week_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cur_sections_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "fac_faculty"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "cur_sections_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "vw_faculty_week_load"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "cur_sections_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "cur_sections_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "cur_sections_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "cur_sections_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      cur_session_recordings: {
        Row: {
          created_at: string
          duration_minutes: number | null
          recording_id: number
          session_id: string
          updated_at: string
          uploaded_at: string
          url: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          recording_id?: number
          session_id: string
          updated_at?: string
          uploaded_at?: string
          url: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          recording_id?: number
          session_id?: string
          updated_at?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "cur_session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "cur_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      cur_sessions: {
        Row: {
          created_at: string
          description: string | null
          end_at: string | null
          id: string
          start_at: string
          title: string | null
          updated_at: string
          week_id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          start_at: string
          title?: string | null
          updated_at?: string
          week_id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          start_at?: string
          title?: string | null
          updated_at?: string
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cur_sessions_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "cur_sessions_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      cur_topics: {
        Row: {
          is_core_topic: boolean | null
          topic_description: string | null
          topic_id: number
          topic_order: number
          topic_title: string
          week_id: number
        }
        Insert: {
          is_core_topic?: boolean | null
          topic_description?: string | null
          topic_id?: number
          topic_order: number
          topic_title: string
          week_id: number
        }
        Update: {
          is_core_topic?: boolean | null
          topic_description?: string | null
          topic_id?: number
          topic_order?: number
          topic_title?: string
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cur_topics_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "cur_topics_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      cur_week_resources: {
        Row: {
          created_at: string
          id: number
          ordering: number | null
          resource_id: number
          updated_at: string
          week_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          ordering?: number | null
          resource_id: number
          updated_at?: string
          week_id: number
        }
        Update: {
          created_at?: string
          id?: number
          ordering?: number | null
          resource_id?: number
          updated_at?: string
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cur_week_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "res_resources"
            referencedColumns: ["resource_id"]
          },
          {
            foreignKeyName: "cur_week_resources_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "cur_week_resources_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      cur_weeks: {
        Row: {
          description: string | null
          month_id: number
          practical_hours: number | null
          self_study_hours: number | null
          theory_hours: number | null
          week_end: number
          week_id: number
          week_start: number
          week_title: string
        }
        Insert: {
          description?: string | null
          month_id: number
          practical_hours?: number | null
          self_study_hours?: number | null
          theory_hours?: number | null
          week_end: number
          week_id?: number
          week_start: number
          week_title: string
        }
        Update: {
          description?: string | null
          month_id?: number
          practical_hours?: number | null
          self_study_hours?: number | null
          theory_hours?: number | null
          week_end?: number
          week_id?: number
          week_start?: number
          week_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cur_weeks_month_id_fkey"
            columns: ["month_id"]
            isOneToOne: false
            referencedRelation: "cur_months"
            referencedColumns: ["month_id"]
          },
          {
            foreignKeyName: "cur_weeks_month_id_fkey"
            columns: ["month_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["month_id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed: boolean | null
          course_id: string
          id: string
          progress_percent: number | null
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          course_id: string
          id?: string
          progress_percent?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          course_id?: string
          id?: string
          progress_percent?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fac_assignments: {
        Row: {
          assigned_at: string | null
          faculty_id: number
          id: string
          role: string | null
          week_id: number
        }
        Insert: {
          assigned_at?: string | null
          faculty_id: number
          id?: string
          role?: string | null
          week_id: number
        }
        Update: {
          assigned_at?: string | null
          faculty_id?: number
          id?: string
          role?: string | null
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fac_assignments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "fac_faculty"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "fac_assignments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "vw_faculty_week_load"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "fac_assignments_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "fac_assignments_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      fac_faculty: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          faculty_id: number
          first_name: string
          is_guest_faculty: boolean | null
          is_lead_faculty: boolean | null
          last_name: string
          phone: string | null
          profile_image_url: string | null
          published_works: string | null
          specialization: string | null
          traditional_lineage: string | null
          updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          faculty_id?: number
          first_name: string
          is_guest_faculty?: boolean | null
          is_lead_faculty?: boolean | null
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          published_works?: string | null
          specialization?: string | null
          traditional_lineage?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          faculty_id?: number
          first_name?: string
          is_guest_faculty?: boolean | null
          is_lead_faculty?: boolean | null
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          published_works?: string | null
          specialization?: string | null
          traditional_lineage?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      fac_mentor_assignments: {
        Row: {
          active: boolean
          assignment_id: number
          created_at: string
          end_date: string | null
          mentor_id: number
          notes: string | null
          start_date: string
          student_id: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          assignment_id?: number
          created_at?: string
          end_date?: string | null
          mentor_id: number
          notes?: string | null
          start_date: string
          student_id: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          assignment_id?: number
          created_at?: string
          end_date?: string | null
          mentor_id?: number
          notes?: string | null
          start_date?: string
          student_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fac_mentor_assignments_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "fac_faculty"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "fac_mentor_assignments_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "vw_faculty_week_load"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "fac_mentor_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fac_mentor_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fac_mentor_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fac_mentor_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      fac_mentor_requirements: {
        Row: {
          description: string | null
          level_id: number
          mentor_type: string
          requirement_id: number
          student_ratio: string
        }
        Insert: {
          description?: string | null
          level_id: number
          mentor_type: string
          requirement_id?: number
          student_ratio: string
        }
        Update: {
          description?: string | null
          level_id?: number
          mentor_type?: string
          requirement_id?: number
          student_ratio?: string
        }
        Relationships: [
          {
            foreignKeyName: "fac_mentor_requirements_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "fac_mentor_requirements_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
        ]
      }
      fac_mentorship_sessions: {
        Row: {
          assignment_id: number
          created_at: string
          duration_minutes: number | null
          notes: string | null
          recording_url: string | null
          session_at: string
          session_id: number
          updated_at: string
        }
        Insert: {
          assignment_id: number
          created_at?: string
          duration_minutes?: number | null
          notes?: string | null
          recording_url?: string | null
          session_at: string
          session_id?: number
          updated_at?: string
        }
        Update: {
          assignment_id?: number
          created_at?: string
          duration_minutes?: number | null
          notes?: string | null
          recording_url?: string | null
          session_at?: string
          session_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fac_mentorship_sessions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "fac_mentor_assignments"
            referencedColumns: ["assignment_id"]
          },
        ]
      }
      lesson_completions: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_completions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          order_index: number
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      mantra_sessions: {
        Row: {
          created_at: string
          duration_seconds: number
          end_time: string | null
          id: string
          mantra_type: string
          notes: string | null
          repetitions: number
          start_time: string
          target_repetitions: number
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          end_time?: string | null
          id?: string
          mantra_type?: string
          notes?: string | null
          repetitions?: number
          start_time?: string
          target_repetitions?: number
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          end_time?: string | null
          id?: string
          mantra_type?: string
          notes?: string | null
          repetitions?: number
          start_time?: string
          target_repetitions?: number
          tenant_id?: string
          user_id?: string
        }
        Relationships: []
      }
      meditation_sessions: {
        Row: {
          created_at: string
          duration_seconds: number
          end_time: string | null
          id: string
          notes: string | null
          practice_type: string
          start_time: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          end_time?: string | null
          id?: string
          notes?: string | null
          practice_type: string
          start_time?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          end_time?: string | null
          id?: string
          notes?: string | null
          practice_type?: string
          start_time?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: []
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
      pkg_course_packages: {
        Row: {
          description: string | null
          duration_months: number
          hours_per_week: number | null
          is_active: boolean | null
          package_id: number
          package_name: string
          package_type: Database["public"]["Enums"]["pkg_package_type_enum"]
          payment_installments: number | null
          payment_plan_available: boolean | null
          savings_usd: number | null
          total_fee_usd: number
        }
        Insert: {
          description?: string | null
          duration_months: number
          hours_per_week?: number | null
          is_active?: boolean | null
          package_id?: number
          package_name: string
          package_type: Database["public"]["Enums"]["pkg_package_type_enum"]
          payment_installments?: number | null
          payment_plan_available?: boolean | null
          savings_usd?: number | null
          total_fee_usd: number
        }
        Update: {
          description?: string | null
          duration_months?: number
          hours_per_week?: number | null
          is_active?: boolean | null
          package_id?: number
          package_name?: string
          package_type?: Database["public"]["Enums"]["pkg_package_type_enum"]
          payment_installments?: number | null
          payment_plan_available?: boolean | null
          savings_usd?: number | null
          total_fee_usd?: number
        }
        Relationships: []
      }
      pkg_inclusions: {
        Row: {
          inclusion_id: number
          inclusion_item: string
          inclusion_order: number
          package_id: number
        }
        Insert: {
          inclusion_id?: number
          inclusion_item: string
          inclusion_order: number
          package_id: number
        }
        Update: {
          inclusion_id?: number
          inclusion_item?: string
          inclusion_order?: number
          package_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pkg_inclusions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "pkg_course_packages"
            referencedColumns: ["package_id"]
          },
        ]
      }
      pkg_pricing_tiers: {
        Row: {
          description: string | null
          package_id: number
          price_usd: number
          tier_id: number
          tier_name: string
        }
        Insert: {
          description?: string | null
          package_id: number
          price_usd: number
          tier_id?: number
          tier_name: string
        }
        Update: {
          description?: string | null
          package_id?: number
          price_usd?: number
          tier_id?: number
          tier_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "pkg_pricing_tiers_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "pkg_course_packages"
            referencedColumns: ["package_id"]
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
      pranayama_sessions: {
        Row: {
          created_at: string
          duration_seconds: number
          end_time: string | null
          id: string
          notes: string | null
          practice_type: string
          start_time: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds: number
          end_time?: string | null
          id?: string
          notes?: string | null
          practice_type: string
          start_time?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          end_time?: string | null
          id?: string
          notes?: string | null
          practice_type?: string
          start_time?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pranayama_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
      qa_student_feedback: {
        Row: {
          comments: string | null
          created_at: string
          enrollment_id: number | null
          feedback_id: number
          level_id: number | null
          organization_id: string | null
          rating_content: number | null
          rating_instructor: number | null
          rating_overall: number | null
          rating_support: number | null
          student_id: number
          submitted_at: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          enrollment_id?: number | null
          feedback_id?: number
          level_id?: number | null
          organization_id?: string | null
          rating_content?: number | null
          rating_instructor?: number | null
          rating_overall?: number | null
          rating_support?: number | null
          student_id: number
          submitted_at?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          enrollment_id?: number | null
          feedback_id?: number
          level_id?: number | null
          organization_id?: string | null
          rating_content?: number | null
          rating_instructor?: number | null
          rating_overall?: number | null
          rating_support?: number | null
          student_id?: number
          submitted_at?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_student_feedback_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "stu_enrollments"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_student_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "qa_student_feedback_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      res_resources: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          metadata: Json | null
          resource_id: number
          title: string
          type_id: number
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          metadata?: Json | null
          resource_id?: number
          title: string
          type_id: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          metadata?: Json | null
          resource_id?: number
          title?: string
          type_id?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "res_resources_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "res_types"
            referencedColumns: ["type_id"]
          },
        ]
      }
      res_section_resources: {
        Row: {
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          order_index: number | null
          resource_type: string | null
          section_id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          order_index?: number | null
          resource_type?: string | null
          section_id: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          order_index?: number | null
          resource_type?: string | null
          section_id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "res_section_resources_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "cur_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      res_types: {
        Row: {
          type_id: number
          type_name: string
        }
        Insert: {
          type_id?: number
          type_name: string
        }
        Update: {
          type_id?: number
          type_name?: string
        }
        Relationships: []
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
      stu_assessments: {
        Row: {
          assessment_date: string | null
          assessment_id: number
          attempt_number: number | null
          evaluated_by: number | null
          evaluated_date: string | null
          feedback: string | null
          marks_obtained: number | null
          max_marks: number | null
          passed: boolean | null
          percentage: number | null
          student_assessment_id: number
          student_id: number
        }
        Insert: {
          assessment_date?: string | null
          assessment_id: number
          attempt_number?: number | null
          evaluated_by?: number | null
          evaluated_date?: string | null
          feedback?: string | null
          marks_obtained?: number | null
          max_marks?: number | null
          passed?: boolean | null
          percentage?: number | null
          student_assessment_id?: number
          student_id: number
        }
        Update: {
          assessment_date?: string | null
          assessment_id?: number
          attempt_number?: number | null
          evaluated_by?: number | null
          evaluated_date?: string | null
          feedback?: string | null
          marks_obtained?: number | null
          max_marks?: number | null
          passed?: boolean | null
          percentage?: number | null
          student_assessment_id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "stu_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "asm_assessments"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "stu_assessments_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "fac_faculty"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "stu_assessments_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "vw_faculty_week_load"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "stu_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      stu_attendance: {
        Row: {
          created_at: string
          id: string
          membership_id: string
          notes: string | null
          session_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          membership_id: string
          notes?: string | null
          session_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          membership_id?: string
          notes?: string | null
          session_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stu_attendance_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "academy_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stu_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "cur_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stu_certifications: {
        Row: {
          blockchain_hash: string | null
          certificate_number: string
          certification_id: number
          is_active: boolean | null
          issue_date: string
          level_id: number
          student_id: number
          verification_url: string | null
        }
        Insert: {
          blockchain_hash?: string | null
          certificate_number: string
          certification_id?: number
          is_active?: boolean | null
          issue_date: string
          level_id: number
          student_id: number
          verification_url?: string | null
        }
        Update: {
          blockchain_hash?: string | null
          certificate_number?: string
          certification_id?: number
          is_active?: boolean | null
          issue_date?: string
          level_id?: number
          student_id?: number
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stu_certifications_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_certifications_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      stu_cohort_members: {
        Row: {
          cohort_id: string
          id: string
          joined_at: string
          membership_id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          cohort_id: string
          id?: string
          joined_at?: string
          membership_id: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          cohort_id?: string
          id?: string
          joined_at?: string
          membership_id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stu_cohort_members_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "stu_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stu_cohort_members_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "academy_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      stu_cohorts: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          level_id: number | null
          max_students: number | null
          name: string
          notes: string | null
          start_date: string | null
          status: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          level_id?: number | null
          max_students?: number | null
          name: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          level_id?: number | null
          max_students?: number | null
          name?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stu_cohorts_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_cohorts_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_cohorts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      stu_enrollments: {
        Row: {
          actual_completion_date: string | null
          enrollment_date: string
          enrollment_id: number
          expected_completion_date: string | null
          level_id: number
          organization_id: string | null
          package_id: number
          payment_status: Database["public"]["Enums"]["stu_payment_status_enum"]
          start_date: string | null
          status: Database["public"]["Enums"]["stu_enrollment_status_enum"]
          student_id: number
          tenant_id: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          enrollment_date: string
          enrollment_id?: number
          expected_completion_date?: string | null
          level_id: number
          organization_id?: string | null
          package_id: number
          payment_status?: Database["public"]["Enums"]["stu_payment_status_enum"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["stu_enrollment_status_enum"]
          student_id: number
          tenant_id?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          enrollment_date?: string
          enrollment_id?: number
          expected_completion_date?: string | null
          level_id?: number
          organization_id?: string | null
          package_id?: number
          payment_status?: Database["public"]["Enums"]["stu_payment_status_enum"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["stu_enrollment_status_enum"]
          student_id?: number
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stu_enrollments_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_enrollments_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_enrollments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stu_enrollments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "pkg_course_packages"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "stu_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_enrollments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      stu_payment_installments: {
        Row: {
          amount_usd: number
          created_at: string
          due_date: string
          enrollment_id: number
          installment_id: number
          installment_number: number
          notes: string | null
          paid_date: string | null
          status: Database["public"]["Enums"]["installment_status_enum"]
          updated_at: string
        }
        Insert: {
          amount_usd: number
          created_at?: string
          due_date: string
          enrollment_id: number
          installment_id?: number
          installment_number: number
          notes?: string | null
          paid_date?: string | null
          status?: Database["public"]["Enums"]["installment_status_enum"]
          updated_at?: string
        }
        Update: {
          amount_usd?: number
          created_at?: string
          due_date?: string
          enrollment_id?: number
          installment_id?: number
          installment_number?: number
          notes?: string | null
          paid_date?: string | null
          status?: Database["public"]["Enums"]["installment_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stu_payment_installments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "stu_enrollments"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "stu_payment_installments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "stu_payment_installments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["enrollment_id"]
          },
        ]
      }
      stu_payments: {
        Row: {
          amount_usd: number
          enrollment_id: number
          external_ref: string | null
          notes: string | null
          payment_date: string | null
          payment_id: string
          status: Database["public"]["Enums"]["payment_status_enum"]
        }
        Insert: {
          amount_usd: number
          enrollment_id: number
          external_ref?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_id?: string
          status?: Database["public"]["Enums"]["payment_status_enum"]
        }
        Update: {
          amount_usd?: number
          enrollment_id?: number
          external_ref?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_id?: string
          status?: Database["public"]["Enums"]["payment_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "stu_payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "stu_enrollments"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "stu_payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "stu_payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["enrollment_id"]
          },
        ]
      }
      stu_progress: {
        Row: {
          completed_date: string | null
          completion_percentage: number | null
          notes: string | null
          organization_id: string | null
          progress_id: number
          started_date: string | null
          status: Database["public"]["Enums"]["stu_progress_status_enum"] | null
          student_id: number
          tenant_id: string | null
          week_id: number
        }
        Insert: {
          completed_date?: string | null
          completion_percentage?: number | null
          notes?: string | null
          organization_id?: string | null
          progress_id?: number
          started_date?: string | null
          status?:
            | Database["public"]["Enums"]["stu_progress_status_enum"]
            | null
          student_id: number
          tenant_id?: string | null
          week_id: number
        }
        Update: {
          completed_date?: string | null
          completion_percentage?: number | null
          notes?: string | null
          organization_id?: string | null
          progress_id?: number
          started_date?: string | null
          status?:
            | Database["public"]["Enums"]["stu_progress_status_enum"]
            | null
          student_id?: number
          tenant_id?: string | null
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "stu_progress_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stu_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "stu_students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_active_students_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_enrollment_overview"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "vw_student_performance_metrics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stu_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stu_progress_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "stu_progress_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      stu_students: {
        Row: {
          country: string | null
          created_at: string | null
          current_level_id: number | null
          email: string
          enrollment_date: string
          first_name: string
          is_active: boolean | null
          last_name: string
          organization_id: string | null
          phone: string | null
          sos_astro_account_id: string | null
          student_id: number
          tenant_id: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          current_level_id?: number | null
          email: string
          enrollment_date: string
          first_name: string
          is_active?: boolean | null
          last_name: string
          organization_id?: string | null
          phone?: string | null
          sos_astro_account_id?: string | null
          student_id?: number
          tenant_id?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          current_level_id?: number | null
          email?: string
          enrollment_date?: string
          first_name?: string
          is_active?: boolean | null
          last_name?: string
          organization_id?: string | null
          phone?: string | null
          sos_astro_account_id?: string | null
          student_id?: number
          tenant_id?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stu_students_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_students_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_students_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stu_students_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
      topic_to_lesson_mappings: {
        Row: {
          certification_level: string
          course_id: string | null
          created_at: string
          id: string
          language: string | null
          lesson_id: string | null
          lesson_slug: string | null
          month_number: number | null
          topic_key: string | null
          topic_text: string
          updated_at: string
          week_end: number | null
          week_start: number | null
        }
        Insert: {
          certification_level: string
          course_id?: string | null
          created_at?: string
          id?: string
          language?: string | null
          lesson_id?: string | null
          lesson_slug?: string | null
          month_number?: number | null
          topic_key?: string | null
          topic_text: string
          updated_at?: string
          week_end?: number | null
          week_start?: number | null
        }
        Update: {
          certification_level?: string
          course_id?: string | null
          created_at?: string
          id?: string
          language?: string | null
          lesson_id?: string | null
          lesson_slug?: string | null
          month_number?: number | null
          topic_key?: string | null
          topic_text?: string
          updated_at?: string
          week_end?: number | null
          week_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_to_lesson_mappings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_to_lesson_mappings_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_birth_data: {
        Row: {
          created_at: string
          date: string
          id: number
          location: string
          name: string
          relationship: string | null
          tenant_id: string
          time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: number
          location: string
          name: string
          relationship?: string | null
          tenant_id: string
          time: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: number
          location?: string
          name?: string
          relationship?: string | null
          tenant_id?: string
          time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_birth_data_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
            referencedRelation: "admin_profile_view"
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
      user_themes: {
        Row: {
          colors: Json
          created_at: string | null
          gradients: Json
          id: string
          is_default: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          colors: Json
          created_at?: string | null
          gradients?: Json
          id?: string
          is_default?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          colors?: Json
          created_at?: string | null
          gradients?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_profile_view: {
        Row: {
          address_masked: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          is_active: boolean | null
          last_login_at: string | null
          last_name: string | null
          organization_id: string | null
          phone_masked: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          address_masked?: never
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          organization_id?: string | null
          phone_masked?: never
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address_masked?: never
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          organization_id?: string | null
          phone_masked?: never
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      vw_active_students_progress: {
        Row: {
          avg_completion_percentage: number | null
          email: string | null
          enrollment_id: number | null
          enrollment_status:
            | Database["public"]["Enums"]["stu_enrollment_status_enum"]
            | null
          first_name: string | null
          last_activity_at: string | null
          last_name: string | null
          level_id: number | null
          level_name: string | null
          payment_status:
            | Database["public"]["Enums"]["stu_payment_status_enum"]
            | null
          student_id: number | null
          weeks_completed: number | null
          weeks_in_progress: number | null
          weeks_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stu_students_current_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_students_current_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
        ]
      }
      vw_curriculum_outline: {
        Row: {
          level_id: number | null
          level_name: string | null
          month_id: number | null
          month_number: number | null
          month_title: string | null
          topic_id: number | null
          topic_order: number | null
          topic_title: string | null
          week_end: number | null
          week_id: number | null
          week_start: number | null
          week_title: string | null
        }
        Relationships: []
      }
      vw_faculty_week_load: {
        Row: {
          faculty_id: number | null
          first_name: string | null
          last_name: string | null
          week_end: number | null
          week_id: number | null
          week_start: number | null
          week_title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fac_assignments_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "cur_weeks"
            referencedColumns: ["week_id"]
          },
          {
            foreignKeyName: "fac_assignments_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["week_id"]
          },
        ]
      }
      vw_revenue_analysis: {
        Row: {
          installment_count: number | null
          month: string | null
          paid_amount: number | null
          pending_amount: number | null
        }
        Relationships: []
      }
      vw_student_enrollment_overview: {
        Row: {
          enrollment_date: string | null
          enrollment_id: number | null
          first_name: string | null
          last_name: string | null
          level_id: number | null
          level_name: string | null
          package_name: string | null
          payment_status:
            | Database["public"]["Enums"]["stu_payment_status_enum"]
            | null
          status:
            | Database["public"]["Enums"]["stu_enrollment_status_enum"]
            | null
          student_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stu_enrollments_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "cur_certification_levels"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "stu_enrollments_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "vw_curriculum_outline"
            referencedColumns: ["level_id"]
          },
        ]
      }
      vw_student_performance_metrics: {
        Row: {
          assessments_taken: number | null
          avg_score: number | null
          first_name: string | null
          last_name: string | null
          level_name: string | null
          passed_count: number | null
          student_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_secure_share_token: { Args: never; Returns: string }
      get_current_user_organization_id: { Args: never; Returns: string }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_current_user_tenant_id: { Args: never; Returns: string }
      get_profile_sensitive_data: {
        Args: { profile_id: string }
        Returns: {
          address: string
          birth_date: string
          birth_time: string
          phone: string
          timezone: string
        }[]
      }
      has_permission: {
        Args: { action: string; resource: string }
        Returns: boolean
      }
      hash_session_token: { Args: { token: string }; Returns: string }
    }
    Enums: {
      academy_role: "student" | "faculty" | "admin"
      cert_status_enum: "awarded" | "revoked"
      cur_difficulty_level_enum:
        | "Beginner"
        | "Intermediate"
        | "Advanced"
        | "Master"
      cur_level_type_enum:
        | "Foundation"
        | "Practitioner"
        | "Professional"
        | "Master"
      fac_session_type_enum:
        | "One-on-One"
        | "Group"
        | "Emergency"
        | "Project Review"
      installment_status_enum: "pending" | "paid" | "overdue"
      organization_type: "headquarters" | "franchise" | "branch" | "partner"
      payment_status_enum: "pending" | "paid" | "refunded"
      pkg_package_type_enum: "Complete" | "Level-by-Level" | "Fast-Track"
      stu_enrollment_status_enum:
        | "Enrolled"
        | "In Progress"
        | "Completed"
        | "Dropped"
        | "On Hold"
      stu_payment_status_enum: "Pending" | "Partial" | "Paid" | "Refunded"
      stu_progress_status_enum:
        | "Not Started"
        | "In Progress"
        | "Completed"
        | "Skipped"
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
      academy_role: ["student", "faculty", "admin"],
      cert_status_enum: ["awarded", "revoked"],
      cur_difficulty_level_enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Master",
      ],
      cur_level_type_enum: [
        "Foundation",
        "Practitioner",
        "Professional",
        "Master",
      ],
      fac_session_type_enum: [
        "One-on-One",
        "Group",
        "Emergency",
        "Project Review",
      ],
      installment_status_enum: ["pending", "paid", "overdue"],
      organization_type: ["headquarters", "franchise", "branch", "partner"],
      payment_status_enum: ["pending", "paid", "refunded"],
      pkg_package_type_enum: ["Complete", "Level-by-Level", "Fast-Track"],
      stu_enrollment_status_enum: [
        "Enrolled",
        "In Progress",
        "Completed",
        "Dropped",
        "On Hold",
      ],
      stu_payment_status_enum: ["Pending", "Partial", "Paid", "Refunded"],
      stu_progress_status_enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Skipped",
      ],
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
