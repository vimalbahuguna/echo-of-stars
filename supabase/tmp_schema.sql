


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."academy_role" AS ENUM (
    'student',
    'faculty',
    'admin'
);


ALTER TYPE "public"."academy_role" OWNER TO "postgres";


CREATE TYPE "public"."cert_status_enum" AS ENUM (
    'awarded',
    'revoked'
);


ALTER TYPE "public"."cert_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."cur_difficulty_level_enum" AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced',
    'Master'
);


ALTER TYPE "public"."cur_difficulty_level_enum" OWNER TO "postgres";


CREATE TYPE "public"."cur_level_type_enum" AS ENUM (
    'Foundation',
    'Practitioner',
    'Professional',
    'Master'
);


ALTER TYPE "public"."cur_level_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."fac_session_type_enum" AS ENUM (
    'One-on-One',
    'Group',
    'Emergency',
    'Project Review'
);


ALTER TYPE "public"."fac_session_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."installment_status_enum" AS ENUM (
    'pending',
    'paid',
    'overdue'
);


ALTER TYPE "public"."installment_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."organization_type" AS ENUM (
    'headquarters',
    'franchise',
    'branch',
    'partner'
);


ALTER TYPE "public"."organization_type" OWNER TO "postgres";


CREATE TYPE "public"."payment_status_enum" AS ENUM (
    'pending',
    'paid',
    'refunded'
);


ALTER TYPE "public"."payment_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."pkg_package_type_enum" AS ENUM (
    'Complete',
    'Level-by-Level',
    'Fast-Track'
);


ALTER TYPE "public"."pkg_package_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."stu_enrollment_status_enum" AS ENUM (
    'Enrolled',
    'In Progress',
    'Completed',
    'Dropped',
    'On Hold'
);


ALTER TYPE "public"."stu_enrollment_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."stu_payment_status_enum" AS ENUM (
    'Pending',
    'Partial',
    'Paid',
    'Refunded'
);


ALTER TYPE "public"."stu_payment_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."stu_progress_status_enum" AS ENUM (
    'Not Started',
    'In Progress',
    'Completed',
    'Skipped'
);


ALTER TYPE "public"."stu_progress_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."subscription_tier" AS ENUM (
    'basic',
    'professional',
    'enterprise',
    'custom'
);


ALTER TYPE "public"."subscription_tier" OWNER TO "postgres";


CREATE TYPE "public"."tenant_status" AS ENUM (
    'active',
    'suspended',
    'inactive',
    'trial'
);


ALTER TYPE "public"."tenant_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'super_admin',
    'tenant_admin',
    'organization_admin',
    'franchise_admin',
    'manager',
    'customer',
    'end_user'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_secure_share_token"() RETURNS "text"
    LANGUAGE "sql"
    AS $$
  SELECT encode(extensions.gen_random_bytes(32), 'base64url');
$$;


ALTER FUNCTION "public"."generate_secure_share_token"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_user_organization_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;


ALTER FUNCTION "public"."get_current_user_organization_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_user_role"() RETURNS "public"."user_role"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid()
$$;


ALTER FUNCTION "public"."get_current_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_user_tenant_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
$$;


ALTER FUNCTION "public"."get_current_user_tenant_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_profile_sensitive_data"("profile_id" "uuid") RETURNS TABLE("phone" "text", "address" "text", "birth_date" "date", "birth_time" time without time zone, "timezone" "text")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT 
    p.phone,
    p.address,
    p.birth_date,
    p.birth_time,
    p.timezone
  FROM public.profiles p
  WHERE p.id = profile_id
    AND (
      -- Only allow if requester is super admin or the profile owner
      get_current_user_role() = 'super_admin'::user_role
      OR auth.uid() = profile_id
    );
$$;


ALTER FUNCTION "public"."get_profile_sensitive_data"("profile_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user_registration"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    default_tenant_id UUID;
    user_email TEXT;
BEGIN
    -- Get user email from auth.users
    user_email := NEW.email;
    
    -- For demo purposes, assign to a default tenant or create one
    -- In production, this would be handled by your registration flow
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default' LIMIT 1;
    
    -- If no default tenant exists, create one
    IF default_tenant_id IS NULL THEN
        INSERT INTO public.tenants (name, slug, status, subscription_tier)
        VALUES ('Default Tenant', 'default', 'active', 'basic')
        RETURNING id INTO default_tenant_id;
    END IF;
    
    -- Insert user profile
    INSERT INTO public.profiles (
        id, 
        tenant_id, 
        email, 
        first_name, 
        last_name,
        role
    ) VALUES (
        NEW.id,
        default_tenant_id,
        user_email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name',
        COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'end_user')
    ) ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user_registration"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_permission"("resource" "text", "action" "text") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $_$
    SELECT EXISTS (
        SELECT 1 FROM public.role_permissions rp
        JOIN public.profiles p ON p.tenant_id = rp.tenant_id
        WHERE p.id = auth.uid()
        AND rp.role = p.role
        AND rp.resource = $1
        AND $2 = ANY(rp.actions)
    )
$_$;


ALTER FUNCTION "public"."has_permission"("resource" "text", "action" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hash_session_token"("token" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $$
  SELECT encode(digest(token, 'sha256'), 'hex');
$$;


ALTER FUNCTION "public"."hash_session_token"("token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."academy_memberships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "organization_id" "uuid",
    "role" "public"."academy_role" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."academy_memberships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "tenant_id" "uuid",
    "organization_id" "uuid",
    "role" "public"."user_role" DEFAULT 'end_user'::"public"."user_role",
    "first_name" "text",
    "last_name" "text",
    "email" "text" NOT NULL,
    "phone" "text",
    "avatar_url" "text",
    "country_id" "uuid",
    "state_id" "uuid",
    "city_id" "uuid",
    "address" "text",
    "birth_date" "date",
    "birth_time" time without time zone,
    "birth_city_id" "uuid",
    "timezone" "text",
    "preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true,
    "last_login_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."admin_profile_view" WITH ("security_invoker"='on') AS
 SELECT "id",
    "tenant_id",
    "organization_id",
    "role",
    "first_name",
    "last_name",
    "email",
    "is_active",
    "last_login_at",
    "created_at",
    "updated_at",
        CASE
            WHEN ("public"."get_current_user_role"() = 'super_admin'::"public"."user_role") THEN "phone"
            ELSE ('***-***-'::"text" || "right"(COALESCE("phone", ''::"text"), 4))
        END AS "phone_masked",
        CASE
            WHEN ("public"."get_current_user_role"() = 'super_admin'::"public"."user_role") THEN "address"
            ELSE ("left"(COALESCE("address", ''::"text"), 20) || '...'::"text")
        END AS "address_masked"
   FROM "public"."profiles"
  WHERE (("tenant_id" = "public"."get_current_user_tenant_id"()) AND (("public"."get_current_user_role"() = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"])) OR ("id" = "auth"."uid"())));


ALTER VIEW "public"."admin_profile_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asm_assessment_results" (
    "result_id" bigint NOT NULL,
    "assessment_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "score" numeric(5,2),
    "passed" boolean,
    "graded_at" timestamp with time zone,
    "grader_faculty_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."asm_assessment_results" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."asm_assessment_results_result_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."asm_assessment_results_result_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."asm_assessment_results_result_id_seq" OWNED BY "public"."asm_assessment_results"."result_id";



CREATE TABLE IF NOT EXISTS "public"."asm_assessments" (
    "assessment_id" bigint NOT NULL,
    "level_id" bigint NOT NULL,
    "assessment_type_id" bigint NOT NULL,
    "assessment_name" character varying(200) NOT NULL,
    "duration_hours" numeric(5,2),
    "max_marks" integer,
    "quantity" integer DEFAULT 1,
    "description" "text"
);


ALTER TABLE "public"."asm_assessments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."asm_assessments_assessment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."asm_assessments_assessment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."asm_assessments_assessment_id_seq" OWNED BY "public"."asm_assessments"."assessment_id";



CREATE TABLE IF NOT EXISTS "public"."asm_types" (
    "assessment_type_id" bigint NOT NULL,
    "type_name" character varying(100) NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."asm_types" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."asm_types_assessment_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."asm_types_assessment_type_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."asm_types_assessment_type_id_seq" OWNED BY "public"."asm_types"."assessment_type_id";



CREATE TABLE IF NOT EXISTS "public"."birth_charts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "chart_name" "text" NOT NULL,
    "birth_date" "date" NOT NULL,
    "birth_time" time without time zone,
    "birth_city_id" "uuid",
    "birth_latitude" numeric(10,8),
    "birth_longitude" numeric(11,8),
    "timezone" "text",
    "chart_type" "text" DEFAULT 'natal'::"text" NOT NULL,
    "astrological_system" "text" DEFAULT 'western'::"text" NOT NULL,
    "chart_data" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."birth_charts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cert_certifications_awarded" (
    "award_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "level_id" bigint NOT NULL,
    "certificate_code" character varying(50),
    "status" "public"."cert_status_enum" DEFAULT 'awarded'::"public"."cert_status_enum" NOT NULL,
    "awarded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cert_certifications_awarded" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cert_certifications_awarded_award_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cert_certifications_awarded_award_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cert_certifications_awarded_award_id_seq" OWNED BY "public"."cert_certifications_awarded"."award_id";



CREATE TABLE IF NOT EXISTS "public"."certificates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "issued_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "certificate_number" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."certificates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chart_interpretations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chart_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "interpretation_type" "text" NOT NULL,
    "ai_model" "text" DEFAULT 'gpt-4o'::"text" NOT NULL,
    "interpretation_text" "text" NOT NULL,
    "confidence_score" numeric(3,2),
    "generated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "feedback_rating" integer,
    "feedback_text" "text",
    "version" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chart_interpretations_feedback_rating_check" CHECK ((("feedback_rating" >= 1) AND ("feedback_rating" <= 5)))
);


ALTER TABLE "public"."chart_interpretations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chart_shares" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chart_id" "uuid" NOT NULL,
    "shared_by_user_id" "uuid" NOT NULL,
    "shared_with_user_id" "uuid",
    "share_token" "text" DEFAULT "encode"("extensions"."gen_random_bytes"(32), 'base64url'::"text") NOT NULL,
    "share_type" "text" DEFAULT 'link'::"text" NOT NULL,
    "permissions" "jsonb" DEFAULT '{"view": true, "comment": false}'::"jsonb",
    "expires_at" timestamp with time zone,
    "access_count" integer DEFAULT 0,
    "last_accessed_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chart_shares" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "conversation_title" "text",
    "context_data" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "sender_type" "text" NOT NULL,
    "message_content" "text" NOT NULL,
    "ai_model" "text",
    "confidence_score" numeric(3,2),
    "context_used" "jsonb",
    "tokens_used" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chat_messages_sender_type_check" CHECK (("sender_type" = ANY (ARRAY['user'::"text", 'ai'::"text"])))
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "state_id" "uuid",
    "name" "text" NOT NULL,
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "population" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."com_forum_posts" (
    "post_id" bigint NOT NULL,
    "topic_id" bigint NOT NULL,
    "author_membership_id" "uuid",
    "parent_post_id" bigint,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."com_forum_posts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."com_forum_posts_post_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."com_forum_posts_post_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."com_forum_posts_post_id_seq" OWNED BY "public"."com_forum_posts"."post_id";



CREATE TABLE IF NOT EXISTS "public"."com_forum_topics" (
    "topic_id" bigint NOT NULL,
    "title" character varying(300) NOT NULL,
    "description" "text",
    "level_id" bigint,
    "week_id" bigint,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."com_forum_topics" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."com_forum_topics_topic_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."com_forum_topics_topic_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."com_forum_topics_topic_id_seq" OWNED BY "public"."com_forum_topics"."topic_id";



CREATE TABLE IF NOT EXISTS "public"."continents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."continents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."countries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "continent_id" "uuid",
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "iso_code" "text" NOT NULL,
    "currency_code" "text",
    "timezone_offset" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "level" "text" DEFAULT 'beginner'::"text",
    "category" "text" NOT NULL,
    "language" "text" DEFAULT 'en'::"text",
    "published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "courses_category_check" CHECK (("category" = ANY (ARRAY['astrology'::"text", 'meditation'::"text", 'sanskrit'::"text", 'scriptures'::"text"]))),
    CONSTRAINT "courses_level_check" CHECK (("level" = ANY (ARRAY['beginner'::"text", 'intermediate'::"text", 'advanced'::"text"])))
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cur_certification_levels" (
    "level_id" bigint NOT NULL,
    "level_name" character varying(100) NOT NULL,
    "level_type" "public"."cur_level_type_enum" NOT NULL,
    "duration_months" integer NOT NULL,
    "duration_weeks" integer NOT NULL,
    "duration_days" integer NOT NULL,
    "sequence_order" integer NOT NULL,
    "passing_score_percentage" numeric(5,2) NOT NULL,
    "fee_usd" numeric(10,2) NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cur_certification_levels" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_certification_levels_level_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_certification_levels_level_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_certification_levels_level_id_seq" OWNED BY "public"."cur_certification_levels"."level_id";



CREATE TABLE IF NOT EXISTS "public"."cur_exercise_logs" (
    "log_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "exercise_id" bigint NOT NULL,
    "status" "public"."stu_progress_status_enum" DEFAULT 'Not Started'::"public"."stu_progress_status_enum",
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "notes" "text"
);


ALTER TABLE "public"."cur_exercise_logs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_exercise_logs_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_exercise_logs_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_exercise_logs_log_id_seq" OWNED BY "public"."cur_exercise_logs"."log_id";



CREATE TABLE IF NOT EXISTS "public"."cur_level_requirements" (
    "requirement_id" bigint NOT NULL,
    "level_id" bigint NOT NULL,
    "requirement_text" "text" NOT NULL,
    "required_hours" integer,
    "prerequisite" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cur_level_requirements" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_level_requirements_requirement_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_level_requirements_requirement_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_level_requirements_requirement_id_seq" OWNED BY "public"."cur_level_requirements"."requirement_id";



CREATE TABLE IF NOT EXISTS "public"."cur_months" (
    "month_id" bigint NOT NULL,
    "level_id" bigint NOT NULL,
    "month_number" integer NOT NULL,
    "month_title" character varying(200) NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."cur_months" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_months_month_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_months_month_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_months_month_id_seq" OWNED BY "public"."cur_months"."month_id";



CREATE TABLE IF NOT EXISTS "public"."cur_practical_exercises" (
    "exercise_id" bigint NOT NULL,
    "week_id" bigint NOT NULL,
    "exercise_title" character varying(300) NOT NULL,
    "exercise_description" "text",
    "exercise_order" integer NOT NULL,
    "estimated_duration_hours" numeric(5,2),
    "difficulty_level" "public"."cur_difficulty_level_enum" NOT NULL
);


ALTER TABLE "public"."cur_practical_exercises" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_practical_exercises_exercise_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_practical_exercises_exercise_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_practical_exercises_exercise_id_seq" OWNED BY "public"."cur_practical_exercises"."exercise_id";



CREATE TABLE IF NOT EXISTS "public"."cur_reading_materials" (
    "material_id" bigint NOT NULL,
    "week_id" bigint NOT NULL,
    "title" character varying(300) NOT NULL,
    "url" "text",
    "kind" "text",
    "added_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cur_reading_materials" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_reading_materials_material_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_reading_materials_material_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_reading_materials_material_id_seq" OWNED BY "public"."cur_reading_materials"."material_id";



CREATE TABLE IF NOT EXISTS "public"."cur_session_recordings" (
    "recording_id" bigint NOT NULL,
    "session_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "duration_minutes" integer,
    "uploaded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cur_session_recordings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_session_recordings_recording_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_session_recordings_recording_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_session_recordings_recording_id_seq" OWNED BY "public"."cur_session_recordings"."recording_id";



CREATE TABLE IF NOT EXISTS "public"."cur_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "week_id" bigint NOT NULL,
    "title" "text",
    "description" "text",
    "start_at" timestamp with time zone NOT NULL,
    "end_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cur_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cur_topics" (
    "topic_id" bigint NOT NULL,
    "week_id" bigint NOT NULL,
    "topic_title" character varying(300) NOT NULL,
    "topic_order" integer NOT NULL,
    "topic_description" "text",
    "is_core_topic" boolean DEFAULT true
);


ALTER TABLE "public"."cur_topics" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_topics_topic_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_topics_topic_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_topics_topic_id_seq" OWNED BY "public"."cur_topics"."topic_id";



CREATE TABLE IF NOT EXISTS "public"."cur_week_resources" (
    "id" bigint NOT NULL,
    "week_id" bigint NOT NULL,
    "resource_id" bigint NOT NULL,
    "ordering" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cur_week_resources" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_week_resources_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_week_resources_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_week_resources_id_seq" OWNED BY "public"."cur_week_resources"."id";



CREATE TABLE IF NOT EXISTS "public"."cur_weeks" (
    "week_id" bigint NOT NULL,
    "month_id" bigint NOT NULL,
    "week_start" integer NOT NULL,
    "week_end" integer NOT NULL,
    "week_title" character varying(200) NOT NULL,
    "theory_hours" numeric(5,2) DEFAULT 0,
    "practical_hours" numeric(5,2) DEFAULT 0,
    "self_study_hours" numeric(5,2) DEFAULT 0,
    "description" "text"
);


ALTER TABLE "public"."cur_weeks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cur_weeks_week_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cur_weeks_week_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cur_weeks_week_id_seq" OWNED BY "public"."cur_weeks"."week_id";



CREATE TABLE IF NOT EXISTS "public"."enrollments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "progress_percent" numeric(5,2) DEFAULT 0,
    "completed" boolean DEFAULT false,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."enrollments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fac_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "faculty_id" bigint NOT NULL,
    "week_id" bigint NOT NULL,
    "role" "text" DEFAULT 'instructor'::"text",
    "assigned_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fac_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fac_faculty" (
    "faculty_id" bigint NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(20),
    "years_of_experience" integer,
    "specialization" character varying(200),
    "bio" "text",
    "is_lead_faculty" boolean DEFAULT false,
    "is_guest_faculty" boolean DEFAULT false,
    "traditional_lineage" character varying(200),
    "published_works" "text",
    "profile_image_url" character varying(500),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fac_faculty" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."fac_faculty_faculty_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."fac_faculty_faculty_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."fac_faculty_faculty_id_seq" OWNED BY "public"."fac_faculty"."faculty_id";



CREATE TABLE IF NOT EXISTS "public"."fac_mentor_assignments" (
    "assignment_id" bigint NOT NULL,
    "mentor_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "active" boolean DEFAULT true NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fac_mentor_assignments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."fac_mentor_assignments_assignment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."fac_mentor_assignments_assignment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."fac_mentor_assignments_assignment_id_seq" OWNED BY "public"."fac_mentor_assignments"."assignment_id";



CREATE TABLE IF NOT EXISTS "public"."fac_mentor_requirements" (
    "requirement_id" bigint NOT NULL,
    "level_id" bigint NOT NULL,
    "mentor_type" character varying(100) NOT NULL,
    "student_ratio" character varying(20) NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."fac_mentor_requirements" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."fac_mentor_requirements_requirement_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."fac_mentor_requirements_requirement_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."fac_mentor_requirements_requirement_id_seq" OWNED BY "public"."fac_mentor_requirements"."requirement_id";



CREATE TABLE IF NOT EXISTS "public"."fac_mentorship_sessions" (
    "session_id" bigint NOT NULL,
    "assignment_id" bigint NOT NULL,
    "session_at" timestamp with time zone NOT NULL,
    "duration_minutes" integer,
    "recording_url" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fac_mentorship_sessions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."fac_mentorship_sessions_session_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."fac_mentorship_sessions_session_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."fac_mentorship_sessions_session_id_seq" OWNED BY "public"."fac_mentorship_sessions"."session_id";



CREATE TABLE IF NOT EXISTS "public"."lesson_completions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "lesson_id" "uuid" NOT NULL,
    "completed_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lesson_completions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "content" "text",
    "order_index" integer DEFAULT 0 NOT NULL,
    "duration_minutes" integer,
    "published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."lessons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mantra_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "mantra_type" "text" DEFAULT 'Om Namah Shivaya'::"text" NOT NULL,
    "target_repetitions" integer DEFAULT 108 NOT NULL,
    "repetitions" integer DEFAULT 0 NOT NULL,
    "duration_seconds" integer DEFAULT 0 NOT NULL,
    "start_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end_time" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."mantra_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meditation_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "practice_type" "text" NOT NULL,
    "duration_seconds" integer DEFAULT 0 NOT NULL,
    "start_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end_time" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."meditation_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "parent_organization_id" "uuid",
    "name" "text" NOT NULL,
    "type" "public"."organization_type" DEFAULT 'branch'::"public"."organization_type",
    "country_id" "uuid",
    "state_id" "uuid",
    "city_id" "uuid",
    "address" "text",
    "contact_email" "text",
    "contact_phone" "text",
    "settings" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pkg_course_packages" (
    "package_id" bigint NOT NULL,
    "package_name" character varying(100) NOT NULL,
    "package_type" "public"."pkg_package_type_enum" NOT NULL,
    "total_fee_usd" numeric(10,2) NOT NULL,
    "duration_months" integer NOT NULL,
    "hours_per_week" integer,
    "savings_usd" numeric(10,2) DEFAULT 0,
    "payment_plan_available" boolean DEFAULT false,
    "payment_installments" integer,
    "description" "text",
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."pkg_course_packages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pkg_course_packages_package_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pkg_course_packages_package_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pkg_course_packages_package_id_seq" OWNED BY "public"."pkg_course_packages"."package_id";



CREATE TABLE IF NOT EXISTS "public"."pkg_inclusions" (
    "inclusion_id" bigint NOT NULL,
    "package_id" bigint NOT NULL,
    "inclusion_item" character varying(300) NOT NULL,
    "inclusion_order" integer NOT NULL
);


ALTER TABLE "public"."pkg_inclusions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pkg_inclusions_inclusion_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pkg_inclusions_inclusion_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pkg_inclusions_inclusion_id_seq" OWNED BY "public"."pkg_inclusions"."inclusion_id";



CREATE TABLE IF NOT EXISTS "public"."pkg_pricing_tiers" (
    "tier_id" bigint NOT NULL,
    "package_id" bigint NOT NULL,
    "tier_name" character varying(100) NOT NULL,
    "price_usd" numeric(10,2) NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."pkg_pricing_tiers" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pkg_pricing_tiers_tier_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pkg_pricing_tiers_tier_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pkg_pricing_tiers_tier_id_seq" OWNED BY "public"."pkg_pricing_tiers"."tier_id";



CREATE TABLE IF NOT EXISTS "public"."planetary_positions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chart_id" "uuid" NOT NULL,
    "planet_name" "text" NOT NULL,
    "longitude" numeric(8,5) NOT NULL,
    "latitude" numeric(8,5),
    "speed" numeric(8,5),
    "house_number" integer,
    "sign_name" "text" NOT NULL,
    "sign_degrees" numeric(5,2) NOT NULL,
    "is_retrograde" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "planetary_positions_house_number_check" CHECK ((("house_number" >= 1) AND ("house_number" <= 12)))
);


ALTER TABLE "public"."planetary_positions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pranayama_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "practice_type" "text" NOT NULL,
    "duration_seconds" integer NOT NULL,
    "start_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end_time" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."pranayama_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."qa_student_feedback" (
    "feedback_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "enrollment_id" bigint,
    "level_id" bigint,
    "rating_content" smallint,
    "rating_instructor" smallint,
    "rating_support" smallint,
    "rating_overall" smallint,
    "comments" "text",
    "submitted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "qa_student_feedback_rating_content_check" CHECK ((("rating_content" >= 1) AND ("rating_content" <= 5))),
    CONSTRAINT "qa_student_feedback_rating_instructor_check" CHECK ((("rating_instructor" >= 1) AND ("rating_instructor" <= 5))),
    CONSTRAINT "qa_student_feedback_rating_overall_check" CHECK ((("rating_overall" >= 1) AND ("rating_overall" <= 5))),
    CONSTRAINT "qa_student_feedback_rating_support_check" CHECK ((("rating_support" >= 1) AND ("rating_support" <= 5)))
);


ALTER TABLE "public"."qa_student_feedback" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."qa_student_feedback_feedback_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."qa_student_feedback_feedback_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."qa_student_feedback_feedback_id_seq" OWNED BY "public"."qa_student_feedback"."feedback_id";



CREATE TABLE IF NOT EXISTS "public"."res_resources" (
    "resource_id" bigint NOT NULL,
    "type_id" smallint NOT NULL,
    "title" character varying(300) NOT NULL,
    "description" "text",
    "url" "text",
    "duration_minutes" integer,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."res_resources" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."res_resources_resource_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."res_resources_resource_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."res_resources_resource_id_seq" OWNED BY "public"."res_resources"."resource_id";



CREATE TABLE IF NOT EXISTS "public"."res_types" (
    "type_id" smallint NOT NULL,
    "type_name" character varying(50) NOT NULL
);


ALTER TABLE "public"."res_types" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."res_types_type_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."res_types_type_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."res_types_type_id_seq" OWNED BY "public"."res_types"."type_id";



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "role" "public"."user_role",
    "resource" "text" NOT NULL,
    "actions" "text"[] NOT NULL,
    "conditions" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."states" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "country_id" "uuid",
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."states" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stu_assessments" (
    "student_assessment_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "assessment_id" bigint NOT NULL,
    "attempt_number" integer DEFAULT 1,
    "assessment_date" "date",
    "marks_obtained" numeric(5,2),
    "max_marks" numeric(5,2),
    "percentage" numeric(5,2),
    "passed" boolean DEFAULT false,
    "feedback" "text",
    "evaluated_by" bigint,
    "evaluated_date" "date"
);


ALTER TABLE "public"."stu_assessments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."stu_assessments_student_assessment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."stu_assessments_student_assessment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."stu_assessments_student_assessment_id_seq" OWNED BY "public"."stu_assessments"."student_assessment_id";



CREATE TABLE IF NOT EXISTS "public"."stu_attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "membership_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'present'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."stu_attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stu_certifications" (
    "certification_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "level_id" bigint NOT NULL,
    "issue_date" "date" NOT NULL,
    "certificate_number" character varying(100) NOT NULL,
    "blockchain_hash" character varying(200),
    "verification_url" character varying(500),
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."stu_certifications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."stu_certifications_certification_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."stu_certifications_certification_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."stu_certifications_certification_id_seq" OWNED BY "public"."stu_certifications"."certification_id";



CREATE TABLE IF NOT EXISTS "public"."stu_enrollments" (
    "enrollment_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "package_id" bigint NOT NULL,
    "level_id" bigint NOT NULL,
    "enrollment_date" "date" NOT NULL,
    "start_date" "date",
    "expected_completion_date" "date",
    "actual_completion_date" "date",
    "status" "public"."stu_enrollment_status_enum" DEFAULT 'Enrolled'::"public"."stu_enrollment_status_enum" NOT NULL,
    "payment_status" "public"."stu_payment_status_enum" DEFAULT 'Pending'::"public"."stu_payment_status_enum" NOT NULL
);


ALTER TABLE "public"."stu_enrollments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."stu_enrollments_enrollment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."stu_enrollments_enrollment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."stu_enrollments_enrollment_id_seq" OWNED BY "public"."stu_enrollments"."enrollment_id";



CREATE TABLE IF NOT EXISTS "public"."stu_payment_installments" (
    "installment_id" bigint NOT NULL,
    "enrollment_id" bigint NOT NULL,
    "installment_number" smallint NOT NULL,
    "amount_usd" numeric(10,2) NOT NULL,
    "due_date" "date" NOT NULL,
    "paid_date" "date",
    "status" "public"."installment_status_enum" DEFAULT 'pending'::"public"."installment_status_enum" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."stu_payment_installments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."stu_payment_installments_installment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."stu_payment_installments_installment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."stu_payment_installments_installment_id_seq" OWNED BY "public"."stu_payment_installments"."installment_id";



CREATE TABLE IF NOT EXISTS "public"."stu_payments" (
    "payment_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "enrollment_id" bigint NOT NULL,
    "amount_usd" numeric(10,2) NOT NULL,
    "status" "public"."payment_status_enum" DEFAULT 'pending'::"public"."payment_status_enum" NOT NULL,
    "payment_date" timestamp with time zone DEFAULT "now"(),
    "external_ref" character varying(200),
    "notes" "text"
);


ALTER TABLE "public"."stu_payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stu_progress" (
    "progress_id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "week_id" bigint NOT NULL,
    "completion_percentage" numeric(5,2) DEFAULT 0,
    "status" "public"."stu_progress_status_enum" DEFAULT 'Not Started'::"public"."stu_progress_status_enum",
    "started_date" "date",
    "completed_date" "date",
    "notes" "text"
);


ALTER TABLE "public"."stu_progress" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."stu_progress_progress_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."stu_progress_progress_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."stu_progress_progress_id_seq" OWNED BY "public"."stu_progress"."progress_id";



CREATE TABLE IF NOT EXISTS "public"."stu_students" (
    "student_id" bigint NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(20),
    "whatsapp" character varying(20),
    "country" character varying(100),
    "enrollment_date" "date" NOT NULL,
    "current_level_id" bigint,
    "sos_astro_account_id" character varying(100),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."stu_students" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."stu_students_student_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."stu_students_student_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."stu_students_student_id_seq" OWNED BY "public"."stu_students"."student_id";



CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "domain" "text",
    "status" "public"."tenant_status" DEFAULT 'trial'::"public"."tenant_status",
    "subscription_tier" "public"."subscription_tier" DEFAULT 'basic'::"public"."subscription_tier",
    "country_id" "uuid",
    "city_id" "uuid",
    "address" "text",
    "contact_email" "text",
    "contact_phone" "text",
    "branding_config" "jsonb" DEFAULT '{}'::"jsonb",
    "feature_config" "jsonb" DEFAULT '{}'::"jsonb",
    "billing_config" "jsonb" DEFAULT '{}'::"jsonb",
    "max_users" integer DEFAULT 10,
    "max_organizations" integer DEFAULT 1,
    "trial_ends_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."topic_to_lesson_mappings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "language" "text" DEFAULT 'en'::"text",
    "certification_level" "text" NOT NULL,
    "month_number" integer,
    "week_start" integer,
    "week_end" integer,
    "topic_key" "text",
    "topic_text" "text" NOT NULL,
    "lesson_id" "uuid",
    "lesson_slug" "text",
    "course_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "topic_to_lesson_mappings_certification_level_check" CHECK (("certification_level" = ANY (ARRAY['foundation'::"text", 'practitioner'::"text", 'professional'::"text", 'master'::"text"])))
);


ALTER TABLE "public"."topic_to_lesson_mappings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_birth_data" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "location" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "relationship" "text",
    "tenant_id" "uuid" NOT NULL
);


ALTER TABLE "public"."user_birth_data" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_birth_data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_birth_data_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_birth_data_id_seq" OWNED BY "public"."user_birth_data"."id";



CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "tenant_id" "uuid",
    "session_token" "text" NOT NULL,
    "ip_address" "text",
    "user_agent" "text",
    "location" "jsonb",
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_themes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "is_default" boolean DEFAULT false,
    "colors" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "gradients" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "public"."user_themes" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_active_students_progress" AS
SELECT
    NULL::bigint AS "student_id",
    NULL::character varying(100) AS "first_name",
    NULL::character varying(100) AS "last_name",
    NULL::character varying(255) AS "email",
    NULL::bigint AS "level_id",
    NULL::character varying(100) AS "level_name",
    NULL::bigint AS "enrollment_id",
    NULL::"public"."stu_enrollment_status_enum" AS "enrollment_status",
    NULL::"public"."stu_payment_status_enum" AS "payment_status",
    NULL::bigint AS "weeks_total",
    NULL::bigint AS "weeks_completed",
    NULL::bigint AS "weeks_in_progress",
    NULL::numeric AS "avg_completion_percentage",
    NULL::timestamp without time zone AS "last_activity_at";


ALTER VIEW "public"."vw_active_students_progress" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_curriculum_outline" AS
 SELECT "l"."level_id",
    "l"."level_name",
    "m"."month_id",
    "m"."month_number",
    "m"."month_title",
    "w"."week_id",
    "w"."week_start",
    "w"."week_end",
    "w"."week_title",
    "t"."topic_id",
    "t"."topic_order",
    "t"."topic_title"
   FROM ((("public"."cur_certification_levels" "l"
     JOIN "public"."cur_months" "m" ON (("m"."level_id" = "l"."level_id")))
     JOIN "public"."cur_weeks" "w" ON (("w"."month_id" = "m"."month_id")))
     LEFT JOIN "public"."cur_topics" "t" ON (("t"."week_id" = "w"."week_id")))
  ORDER BY "l"."sequence_order", "m"."month_number", "w"."week_start", "t"."topic_order";


ALTER VIEW "public"."vw_curriculum_outline" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_faculty_week_load" AS
 SELECT "f"."faculty_id",
    "f"."first_name",
    "f"."last_name",
    "a"."week_id",
    "w"."week_title",
    "w"."week_start",
    "w"."week_end"
   FROM (("public"."fac_faculty" "f"
     JOIN "public"."fac_assignments" "a" ON (("a"."faculty_id" = "f"."faculty_id")))
     JOIN "public"."cur_weeks" "w" ON (("w"."week_id" = "a"."week_id")));


ALTER VIEW "public"."vw_faculty_week_load" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_revenue_analysis" AS
 SELECT "date_trunc"('month'::"text", COALESCE(("paid_date")::timestamp without time zone, ("due_date")::timestamp without time zone)) AS "month",
    "sum"("amount_usd") FILTER (WHERE ("status" = 'paid'::"public"."installment_status_enum")) AS "paid_amount",
    "sum"("amount_usd") FILTER (WHERE ("status" = 'pending'::"public"."installment_status_enum")) AS "pending_amount",
    "count"(*) AS "installment_count"
   FROM "public"."stu_payment_installments" "i"
  GROUP BY ("date_trunc"('month'::"text", COALESCE(("paid_date")::timestamp without time zone, ("due_date")::timestamp without time zone)))
  ORDER BY ("date_trunc"('month'::"text", COALESCE(("paid_date")::timestamp without time zone, ("due_date")::timestamp without time zone)));


ALTER VIEW "public"."vw_revenue_analysis" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_student_enrollment_overview" AS
 SELECT "s"."student_id",
    "s"."first_name",
    "s"."last_name",
    "e"."enrollment_id",
    "e"."status",
    "e"."payment_status",
    "e"."enrollment_date",
    "e"."level_id",
    "l"."level_name",
    "p"."package_name"
   FROM ((("public"."stu_students" "s"
     JOIN "public"."stu_enrollments" "e" ON (("e"."student_id" = "s"."student_id")))
     JOIN "public"."cur_certification_levels" "l" ON (("l"."level_id" = "e"."level_id")))
     LEFT JOIN "public"."pkg_course_packages" "p" ON (("p"."package_id" = "e"."package_id")));


ALTER VIEW "public"."vw_student_enrollment_overview" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_student_performance_metrics" AS
 SELECT "s"."student_id",
    "s"."first_name",
    "s"."last_name",
    "l"."level_name",
    "count"("ar"."result_id") AS "assessments_taken",
    "avg"("ar"."score") AS "avg_score",
    "sum"(
        CASE
            WHEN "ar"."passed" THEN 1
            ELSE 0
        END) AS "passed_count"
   FROM ((("public"."stu_students" "s"
     JOIN "public"."stu_enrollments" "e" ON (("e"."student_id" = "s"."student_id")))
     LEFT JOIN "public"."cur_certification_levels" "l" ON (("l"."level_id" = "e"."level_id")))
     LEFT JOIN "public"."asm_assessment_results" "ar" ON ((("ar"."student_id" = "s"."student_id") AND ("ar"."assessment_id" IN ( SELECT "asm_assessments"."assessment_id"
           FROM "public"."asm_assessments"
          WHERE ("asm_assessments"."level_id" = "e"."level_id"))))))
  GROUP BY "s"."student_id", "s"."first_name", "s"."last_name", "l"."level_name";


ALTER VIEW "public"."vw_student_performance_metrics" OWNER TO "postgres";


ALTER TABLE ONLY "public"."asm_assessment_results" ALTER COLUMN "result_id" SET DEFAULT "nextval"('"public"."asm_assessment_results_result_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."asm_assessments" ALTER COLUMN "assessment_id" SET DEFAULT "nextval"('"public"."asm_assessments_assessment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."asm_types" ALTER COLUMN "assessment_type_id" SET DEFAULT "nextval"('"public"."asm_types_assessment_type_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cert_certifications_awarded" ALTER COLUMN "award_id" SET DEFAULT "nextval"('"public"."cert_certifications_awarded_award_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."com_forum_posts" ALTER COLUMN "post_id" SET DEFAULT "nextval"('"public"."com_forum_posts_post_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."com_forum_topics" ALTER COLUMN "topic_id" SET DEFAULT "nextval"('"public"."com_forum_topics_topic_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_certification_levels" ALTER COLUMN "level_id" SET DEFAULT "nextval"('"public"."cur_certification_levels_level_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_exercise_logs" ALTER COLUMN "log_id" SET DEFAULT "nextval"('"public"."cur_exercise_logs_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_level_requirements" ALTER COLUMN "requirement_id" SET DEFAULT "nextval"('"public"."cur_level_requirements_requirement_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_months" ALTER COLUMN "month_id" SET DEFAULT "nextval"('"public"."cur_months_month_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_practical_exercises" ALTER COLUMN "exercise_id" SET DEFAULT "nextval"('"public"."cur_practical_exercises_exercise_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_reading_materials" ALTER COLUMN "material_id" SET DEFAULT "nextval"('"public"."cur_reading_materials_material_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_session_recordings" ALTER COLUMN "recording_id" SET DEFAULT "nextval"('"public"."cur_session_recordings_recording_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_topics" ALTER COLUMN "topic_id" SET DEFAULT "nextval"('"public"."cur_topics_topic_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_week_resources" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."cur_week_resources_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cur_weeks" ALTER COLUMN "week_id" SET DEFAULT "nextval"('"public"."cur_weeks_week_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."fac_faculty" ALTER COLUMN "faculty_id" SET DEFAULT "nextval"('"public"."fac_faculty_faculty_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."fac_mentor_assignments" ALTER COLUMN "assignment_id" SET DEFAULT "nextval"('"public"."fac_mentor_assignments_assignment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."fac_mentor_requirements" ALTER COLUMN "requirement_id" SET DEFAULT "nextval"('"public"."fac_mentor_requirements_requirement_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."fac_mentorship_sessions" ALTER COLUMN "session_id" SET DEFAULT "nextval"('"public"."fac_mentorship_sessions_session_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pkg_course_packages" ALTER COLUMN "package_id" SET DEFAULT "nextval"('"public"."pkg_course_packages_package_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pkg_inclusions" ALTER COLUMN "inclusion_id" SET DEFAULT "nextval"('"public"."pkg_inclusions_inclusion_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pkg_pricing_tiers" ALTER COLUMN "tier_id" SET DEFAULT "nextval"('"public"."pkg_pricing_tiers_tier_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."qa_student_feedback" ALTER COLUMN "feedback_id" SET DEFAULT "nextval"('"public"."qa_student_feedback_feedback_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."res_resources" ALTER COLUMN "resource_id" SET DEFAULT "nextval"('"public"."res_resources_resource_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."res_types" ALTER COLUMN "type_id" SET DEFAULT "nextval"('"public"."res_types_type_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."stu_assessments" ALTER COLUMN "student_assessment_id" SET DEFAULT "nextval"('"public"."stu_assessments_student_assessment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."stu_certifications" ALTER COLUMN "certification_id" SET DEFAULT "nextval"('"public"."stu_certifications_certification_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."stu_enrollments" ALTER COLUMN "enrollment_id" SET DEFAULT "nextval"('"public"."stu_enrollments_enrollment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."stu_payment_installments" ALTER COLUMN "installment_id" SET DEFAULT "nextval"('"public"."stu_payment_installments_installment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."stu_progress" ALTER COLUMN "progress_id" SET DEFAULT "nextval"('"public"."stu_progress_progress_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."stu_students" ALTER COLUMN "student_id" SET DEFAULT "nextval"('"public"."stu_students_student_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_birth_data" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_birth_data_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."academy_memberships"
    ADD CONSTRAINT "academy_memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asm_assessment_results"
    ADD CONSTRAINT "asm_assessment_results_assessment_id_student_id_key" UNIQUE ("assessment_id", "student_id");



ALTER TABLE ONLY "public"."asm_assessment_results"
    ADD CONSTRAINT "asm_assessment_results_pkey" PRIMARY KEY ("result_id");



ALTER TABLE ONLY "public"."asm_assessments"
    ADD CONSTRAINT "asm_assessments_pkey" PRIMARY KEY ("assessment_id");



ALTER TABLE ONLY "public"."asm_types"
    ADD CONSTRAINT "asm_types_pkey" PRIMARY KEY ("assessment_type_id");



ALTER TABLE ONLY "public"."birth_charts"
    ADD CONSTRAINT "birth_charts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cert_certifications_awarded"
    ADD CONSTRAINT "cert_certifications_awarded_pkey" PRIMARY KEY ("award_id");



ALTER TABLE ONLY "public"."cert_certifications_awarded"
    ADD CONSTRAINT "cert_certifications_awarded_student_id_level_id_key" UNIQUE ("student_id", "level_id");



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_certificate_number_key" UNIQUE ("certificate_number");



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chart_interpretations"
    ADD CONSTRAINT "chart_interpretations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chart_shares"
    ADD CONSTRAINT "chart_shares_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chart_shares"
    ADD CONSTRAINT "chart_shares_share_token_key" UNIQUE ("share_token");



ALTER TABLE ONLY "public"."chat_conversations"
    ADD CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."com_forum_posts"
    ADD CONSTRAINT "com_forum_posts_pkey" PRIMARY KEY ("post_id");



ALTER TABLE ONLY "public"."com_forum_topics"
    ADD CONSTRAINT "com_forum_topics_pkey" PRIMARY KEY ("topic_id");



ALTER TABLE ONLY "public"."continents"
    ADD CONSTRAINT "continents_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."continents"
    ADD CONSTRAINT "continents_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."continents"
    ADD CONSTRAINT "continents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_iso_code_key" UNIQUE ("iso_code");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."cur_certification_levels"
    ADD CONSTRAINT "cur_certification_levels_pkey" PRIMARY KEY ("level_id");



ALTER TABLE ONLY "public"."cur_exercise_logs"
    ADD CONSTRAINT "cur_exercise_logs_pkey" PRIMARY KEY ("log_id");



ALTER TABLE ONLY "public"."cur_exercise_logs"
    ADD CONSTRAINT "cur_exercise_logs_student_id_exercise_id_key" UNIQUE ("student_id", "exercise_id");



ALTER TABLE ONLY "public"."cur_level_requirements"
    ADD CONSTRAINT "cur_level_requirements_pkey" PRIMARY KEY ("requirement_id");



ALTER TABLE ONLY "public"."cur_months"
    ADD CONSTRAINT "cur_months_level_id_month_number_key" UNIQUE ("level_id", "month_number");



ALTER TABLE ONLY "public"."cur_months"
    ADD CONSTRAINT "cur_months_pkey" PRIMARY KEY ("month_id");



ALTER TABLE ONLY "public"."cur_practical_exercises"
    ADD CONSTRAINT "cur_practical_exercises_pkey" PRIMARY KEY ("exercise_id");



ALTER TABLE ONLY "public"."cur_reading_materials"
    ADD CONSTRAINT "cur_reading_materials_pkey" PRIMARY KEY ("material_id");



ALTER TABLE ONLY "public"."cur_session_recordings"
    ADD CONSTRAINT "cur_session_recordings_pkey" PRIMARY KEY ("recording_id");



ALTER TABLE ONLY "public"."cur_sessions"
    ADD CONSTRAINT "cur_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cur_topics"
    ADD CONSTRAINT "cur_topics_pkey" PRIMARY KEY ("topic_id");



ALTER TABLE ONLY "public"."cur_week_resources"
    ADD CONSTRAINT "cur_week_resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cur_week_resources"
    ADD CONSTRAINT "cur_week_resources_week_id_resource_id_key" UNIQUE ("week_id", "resource_id");



ALTER TABLE ONLY "public"."cur_weeks"
    ADD CONSTRAINT "cur_weeks_pkey" PRIMARY KEY ("week_id");



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_user_id_course_id_key" UNIQUE ("user_id", "course_id");



ALTER TABLE ONLY "public"."fac_assignments"
    ADD CONSTRAINT "fac_assignments_faculty_id_week_id_key" UNIQUE ("faculty_id", "week_id");



ALTER TABLE ONLY "public"."fac_assignments"
    ADD CONSTRAINT "fac_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fac_faculty"
    ADD CONSTRAINT "fac_faculty_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."fac_faculty"
    ADD CONSTRAINT "fac_faculty_pkey" PRIMARY KEY ("faculty_id");



ALTER TABLE ONLY "public"."fac_mentor_assignments"
    ADD CONSTRAINT "fac_mentor_assignments_mentor_id_student_id_start_date_key" UNIQUE ("mentor_id", "student_id", "start_date");



ALTER TABLE ONLY "public"."fac_mentor_assignments"
    ADD CONSTRAINT "fac_mentor_assignments_pkey" PRIMARY KEY ("assignment_id");



ALTER TABLE ONLY "public"."fac_mentor_requirements"
    ADD CONSTRAINT "fac_mentor_requirements_pkey" PRIMARY KEY ("requirement_id");



ALTER TABLE ONLY "public"."fac_mentorship_sessions"
    ADD CONSTRAINT "fac_mentorship_sessions_pkey" PRIMARY KEY ("session_id");



ALTER TABLE ONLY "public"."lesson_completions"
    ADD CONSTRAINT "lesson_completions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lesson_completions"
    ADD CONSTRAINT "lesson_completions_user_id_lesson_id_key" UNIQUE ("user_id", "lesson_id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."mantra_sessions"
    ADD CONSTRAINT "mantra_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meditation_sessions"
    ADD CONSTRAINT "meditation_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pkg_course_packages"
    ADD CONSTRAINT "pkg_course_packages_pkey" PRIMARY KEY ("package_id");



ALTER TABLE ONLY "public"."pkg_inclusions"
    ADD CONSTRAINT "pkg_inclusions_pkey" PRIMARY KEY ("inclusion_id");



ALTER TABLE ONLY "public"."pkg_pricing_tiers"
    ADD CONSTRAINT "pkg_pricing_tiers_package_id_tier_name_key" UNIQUE ("package_id", "tier_name");



ALTER TABLE ONLY "public"."pkg_pricing_tiers"
    ADD CONSTRAINT "pkg_pricing_tiers_pkey" PRIMARY KEY ("tier_id");



ALTER TABLE ONLY "public"."planetary_positions"
    ADD CONSTRAINT "planetary_positions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pranayama_sessions"
    ADD CONSTRAINT "pranayama_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_tenant_id_email_key" UNIQUE ("tenant_id", "email");



ALTER TABLE ONLY "public"."qa_student_feedback"
    ADD CONSTRAINT "qa_student_feedback_pkey" PRIMARY KEY ("feedback_id");



ALTER TABLE ONLY "public"."res_resources"
    ADD CONSTRAINT "res_resources_pkey" PRIMARY KEY ("resource_id");



ALTER TABLE ONLY "public"."res_types"
    ADD CONSTRAINT "res_types_pkey" PRIMARY KEY ("type_id");



ALTER TABLE ONLY "public"."res_types"
    ADD CONSTRAINT "res_types_type_name_key" UNIQUE ("type_name");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_tenant_id_role_resource_key" UNIQUE ("tenant_id", "role", "resource");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_country_id_code_key" UNIQUE ("country_id", "code");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stu_assessments"
    ADD CONSTRAINT "stu_assessments_pkey" PRIMARY KEY ("student_assessment_id");



ALTER TABLE ONLY "public"."stu_attendance"
    ADD CONSTRAINT "stu_attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stu_attendance"
    ADD CONSTRAINT "stu_attendance_session_id_membership_id_key" UNIQUE ("session_id", "membership_id");



ALTER TABLE ONLY "public"."stu_certifications"
    ADD CONSTRAINT "stu_certifications_certificate_number_key" UNIQUE ("certificate_number");



ALTER TABLE ONLY "public"."stu_certifications"
    ADD CONSTRAINT "stu_certifications_pkey" PRIMARY KEY ("certification_id");



ALTER TABLE ONLY "public"."stu_enrollments"
    ADD CONSTRAINT "stu_enrollments_pkey" PRIMARY KEY ("enrollment_id");



ALTER TABLE ONLY "public"."stu_payment_installments"
    ADD CONSTRAINT "stu_payment_installments_enrollment_id_installment_number_key" UNIQUE ("enrollment_id", "installment_number");



ALTER TABLE ONLY "public"."stu_payment_installments"
    ADD CONSTRAINT "stu_payment_installments_pkey" PRIMARY KEY ("installment_id");



ALTER TABLE ONLY "public"."stu_payments"
    ADD CONSTRAINT "stu_payments_pkey" PRIMARY KEY ("payment_id");



ALTER TABLE ONLY "public"."stu_progress"
    ADD CONSTRAINT "stu_progress_pkey" PRIMARY KEY ("progress_id");



ALTER TABLE ONLY "public"."stu_students"
    ADD CONSTRAINT "stu_students_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."stu_students"
    ADD CONSTRAINT "stu_students_pkey" PRIMARY KEY ("student_id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_domain_key" UNIQUE ("domain");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."topic_to_lesson_mappings"
    ADD CONSTRAINT "topic_to_lesson_mappings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cur_certification_levels"
    ADD CONSTRAINT "uk_level_type" UNIQUE ("level_type");



ALTER TABLE ONLY "public"."pkg_course_packages"
    ADD CONSTRAINT "uk_package_type" UNIQUE ("package_type");



ALTER TABLE ONLY "public"."stu_progress"
    ADD CONSTRAINT "uk_student_week" UNIQUE ("student_id", "week_id");



ALTER TABLE ONLY "public"."asm_types"
    ADD CONSTRAINT "uk_type_name" UNIQUE ("type_name");



ALTER TABLE ONLY "public"."user_birth_data"
    ADD CONSTRAINT "user_birth_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."user_themes"
    ADD CONSTRAINT "user_themes_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_academy_memberships_org_id" ON "public"."academy_memberships" USING "btree" ("organization_id");



CREATE INDEX "idx_academy_memberships_role" ON "public"."academy_memberships" USING "btree" ("role");



CREATE INDEX "idx_academy_memberships_tenant_id" ON "public"."academy_memberships" USING "btree" ("tenant_id");



CREATE INDEX "idx_academy_memberships_user_id" ON "public"."academy_memberships" USING "btree" ("user_id");



CREATE INDEX "idx_assessment_results_assessment" ON "public"."asm_assessment_results" USING "btree" ("assessment_id");



CREATE INDEX "idx_assessment_results_student" ON "public"."asm_assessment_results" USING "btree" ("student_id");



CREATE INDEX "idx_birth_charts_chart_type" ON "public"."birth_charts" USING "btree" ("chart_type");



CREATE INDEX "idx_birth_charts_created_at" ON "public"."birth_charts" USING "btree" ("created_at");



CREATE INDEX "idx_birth_charts_tenant_id" ON "public"."birth_charts" USING "btree" ("tenant_id");



CREATE INDEX "idx_birth_charts_user_id" ON "public"."birth_charts" USING "btree" ("user_id");



CREATE INDEX "idx_cert_awarded_level" ON "public"."cert_certifications_awarded" USING "btree" ("level_id");



CREATE INDEX "idx_cert_awarded_student" ON "public"."cert_certifications_awarded" USING "btree" ("student_id");



CREATE INDEX "idx_chart_interpretations_chart_id" ON "public"."chart_interpretations" USING "btree" ("chart_id");



CREATE INDEX "idx_chart_interpretations_user_id" ON "public"."chart_interpretations" USING "btree" ("user_id");



CREATE INDEX "idx_chart_shares_chart_id" ON "public"."chart_shares" USING "btree" ("chart_id");



CREATE INDEX "idx_chart_shares_share_token" ON "public"."chart_shares" USING "btree" ("share_token");



CREATE INDEX "idx_chat_conversations_user_id" ON "public"."chat_conversations" USING "btree" ("user_id");



CREATE INDEX "idx_chat_messages_conversation_id" ON "public"."chat_messages" USING "btree" ("conversation_id");



CREATE INDEX "idx_cities_state_id" ON "public"."cities" USING "btree" ("state_id");



CREATE INDEX "idx_countries_continent_id" ON "public"."countries" USING "btree" ("continent_id");



CREATE INDEX "idx_cur_levels_seq" ON "public"."cur_certification_levels" USING "btree" ("sequence_order");



CREATE INDEX "idx_enrollment_date_enroll" ON "public"."stu_enrollments" USING "btree" ("enrollment_date");



CREATE INDEX "idx_enrollment_date_students" ON "public"."stu_students" USING "btree" ("enrollment_date");



CREATE INDEX "idx_enrollments_status" ON "public"."stu_enrollments" USING "btree" ("status", "level_id");



CREATE INDEX "idx_exercise_logs_student" ON "public"."cur_exercise_logs" USING "btree" ("student_id");



CREATE INDEX "idx_feedback_level" ON "public"."qa_student_feedback" USING "btree" ("level_id");



CREATE INDEX "idx_feedback_student" ON "public"."qa_student_feedback" USING "btree" ("student_id");



CREATE INDEX "idx_forum_posts_parent" ON "public"."com_forum_posts" USING "btree" ("parent_post_id");



CREATE INDEX "idx_forum_posts_topic" ON "public"."com_forum_posts" USING "btree" ("topic_id");



CREATE INDEX "idx_forum_topics_level" ON "public"."com_forum_topics" USING "btree" ("level_id");



CREATE INDEX "idx_forum_topics_week" ON "public"."com_forum_topics" USING "btree" ("week_id");



CREATE INDEX "idx_installments_due_date" ON "public"."stu_payment_installments" USING "btree" ("due_date");



CREATE INDEX "idx_installments_enrollment" ON "public"."stu_payment_installments" USING "btree" ("enrollment_id");



CREATE INDEX "idx_level_assessments" ON "public"."asm_assessments" USING "btree" ("level_id");



CREATE INDEX "idx_level_requirements_level" ON "public"."cur_level_requirements" USING "btree" ("level_id");



CREATE INDEX "idx_mantra_sessions_user_tenant_time" ON "public"."mantra_sessions" USING "btree" ("user_id", "tenant_id", "start_time" DESC);



CREATE INDEX "idx_materials_week" ON "public"."cur_reading_materials" USING "btree" ("week_id");



CREATE INDEX "idx_meditation_sessions_user_tenant_time" ON "public"."meditation_sessions" USING "btree" ("user_id", "tenant_id", "start_time" DESC);



CREATE INDEX "idx_mentor_assignments_mentor" ON "public"."fac_mentor_assignments" USING "btree" ("mentor_id");



CREATE INDEX "idx_mentor_assignments_student" ON "public"."fac_mentor_assignments" USING "btree" ("student_id");



CREATE INDEX "idx_mentorship_sessions_assignment" ON "public"."fac_mentorship_sessions" USING "btree" ("assignment_id");



CREATE INDEX "idx_mentorship_sessions_session_at" ON "public"."fac_mentorship_sessions" USING "btree" ("session_at");



CREATE INDEX "idx_month_weeks" ON "public"."cur_weeks" USING "btree" ("month_id", "week_start");



CREATE INDEX "idx_organizations_parent_id" ON "public"."organizations" USING "btree" ("parent_organization_id");



CREATE INDEX "idx_organizations_tenant_id" ON "public"."organizations" USING "btree" ("tenant_id");



CREATE INDEX "idx_package_inclusions" ON "public"."pkg_inclusions" USING "btree" ("package_id", "inclusion_order");



CREATE INDEX "idx_payments_enrollment" ON "public"."stu_payments" USING "btree" ("enrollment_id");



CREATE INDEX "idx_planetary_positions_chart_id" ON "public"."planetary_positions" USING "btree" ("chart_id");



CREATE INDEX "idx_planetary_positions_planet_name" ON "public"."planetary_positions" USING "btree" ("planet_name");



CREATE INDEX "idx_pranayama_sessions_user_tenant_time" ON "public"."pranayama_sessions" USING "btree" ("user_id", "tenant_id", "start_time" DESC);



CREATE INDEX "idx_profiles_organization_id" ON "public"."profiles" USING "btree" ("organization_id");



CREATE INDEX "idx_profiles_role" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "idx_profiles_tenant_id" ON "public"."profiles" USING "btree" ("tenant_id");



CREATE INDEX "idx_progress_completion" ON "public"."stu_progress" USING "btree" ("student_id", "completion_percentage");



CREATE INDEX "idx_resources_type" ON "public"."res_resources" USING "btree" ("type_id");



CREATE INDEX "idx_role_permissions_tenant_role" ON "public"."role_permissions" USING "btree" ("tenant_id", "role");



CREATE INDEX "idx_session_recordings_session" ON "public"."cur_session_recordings" USING "btree" ("session_id");



CREATE INDEX "idx_states_country_id" ON "public"."states" USING "btree" ("country_id");



CREATE INDEX "idx_student_assessments" ON "public"."stu_assessments" USING "btree" ("student_id", "assessment_id");



CREATE INDEX "idx_student_progress" ON "public"."stu_progress" USING "btree" ("student_id", "status");



CREATE INDEX "idx_student_status" ON "public"."stu_enrollments" USING "btree" ("student_id", "status");



CREATE INDEX "idx_students_active" ON "public"."stu_students" USING "btree" ("is_active", "current_level_id");



CREATE INDEX "idx_topic_mappings_level_lang" ON "public"."topic_to_lesson_mappings" USING "btree" ("certification_level", "language");



CREATE INDEX "idx_topic_mappings_text" ON "public"."topic_to_lesson_mappings" USING "btree" ("topic_text");



CREATE INDEX "idx_user_sessions_tenant_id" ON "public"."user_sessions" USING "btree" ("tenant_id");



CREATE INDEX "idx_user_sessions_user_id" ON "public"."user_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_week_exercises" ON "public"."cur_practical_exercises" USING "btree" ("week_id", "exercise_order");



CREATE INDEX "idx_week_resources_resource" ON "public"."cur_week_resources" USING "btree" ("resource_id");



CREATE INDEX "idx_week_resources_week" ON "public"."cur_week_resources" USING "btree" ("week_id");



CREATE INDEX "idx_week_topics" ON "public"."cur_topics" USING "btree" ("week_id", "topic_order");



CREATE UNIQUE INDEX "unique_birth_data_composite" ON "public"."user_birth_data" USING "btree" ("user_id", "lower"("name"), "date", "time", "lower"("location"));



COMMENT ON INDEX "public"."unique_birth_data_composite" IS 'Prevents exact duplicate birth records while allowing multiple family members per user';



CREATE OR REPLACE VIEW "public"."vw_active_students_progress" AS
 SELECT "s"."student_id",
    "s"."first_name",
    "s"."last_name",
    "s"."email",
    "s"."current_level_id" AS "level_id",
    "l"."level_name",
    "e"."enrollment_id",
    "e"."status" AS "enrollment_status",
    "e"."payment_status",
    ( SELECT "count"(*) AS "count"
           FROM ("public"."cur_weeks" "w"
             JOIN "public"."cur_months" "m" ON (("m"."month_id" = "w"."month_id")))
          WHERE ("m"."level_id" = "e"."level_id")) AS "weeks_total",
    COALESCE("sum"(
        CASE
            WHEN ("sp"."status" = 'Completed'::"public"."stu_progress_status_enum") THEN 1
            ELSE 0
        END), (0)::bigint) AS "weeks_completed",
    COALESCE("sum"(
        CASE
            WHEN ("sp"."status" = 'In Progress'::"public"."stu_progress_status_enum") THEN 1
            ELSE 0
        END), (0)::bigint) AS "weeks_in_progress",
    COALESCE("round"("avg"("sp"."completion_percentage"), 2), (0)::numeric) AS "avg_completion_percentage",
    "max"(COALESCE(("sp"."completed_date")::timestamp without time zone, ("sp"."started_date")::timestamp without time zone)) AS "last_activity_at"
   FROM ((("public"."stu_students" "s"
     LEFT JOIN "public"."stu_enrollments" "e" ON (("e"."student_id" = "s"."student_id")))
     LEFT JOIN "public"."cur_certification_levels" "l" ON (("l"."level_id" = "e"."level_id")))
     LEFT JOIN "public"."stu_progress" "sp" ON (("sp"."student_id" = "s"."student_id")))
  WHERE ("s"."is_active" = true)
  GROUP BY "s"."student_id", "s"."first_name", "s"."last_name", "s"."email", "s"."current_level_id", "l"."level_name", "e"."enrollment_id", "e"."status", "e"."payment_status";



CREATE OR REPLACE TRIGGER "set_updated_at_on_academy_memberships" BEFORE UPDATE ON "public"."academy_memberships" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_cur_levels_updated" BEFORE UPDATE ON "public"."cur_certification_levels" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_faculty_updated" BEFORE UPDATE ON "public"."fac_faculty" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_students_updated" BEFORE UPDATE ON "public"."stu_students" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "update_birth_charts_updated_at" BEFORE UPDATE ON "public"."birth_charts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_chart_interpretations_updated_at" BEFORE UPDATE ON "public"."chart_interpretations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_chart_shares_updated_at" BEFORE UPDATE ON "public"."chart_shares" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_chat_conversations_updated_at" BEFORE UPDATE ON "public"."chat_conversations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_cities_updated_at" BEFORE UPDATE ON "public"."cities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_continents_updated_at" BEFORE UPDATE ON "public"."continents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_countries_updated_at" BEFORE UPDATE ON "public"."countries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_organizations_updated_at" BEFORE UPDATE ON "public"."organizations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_states_updated_at" BEFORE UPDATE ON "public"."states" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tenants_updated_at" BEFORE UPDATE ON "public"."tenants" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."academy_memberships"
    ADD CONSTRAINT "academy_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."academy_memberships"
    ADD CONSTRAINT "academy_memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."academy_memberships"
    ADD CONSTRAINT "academy_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."asm_assessment_results"
    ADD CONSTRAINT "asm_assessment_results_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."asm_assessments"("assessment_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."asm_assessment_results"
    ADD CONSTRAINT "asm_assessment_results_grader_faculty_id_fkey" FOREIGN KEY ("grader_faculty_id") REFERENCES "public"."fac_faculty"("faculty_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."asm_assessment_results"
    ADD CONSTRAINT "asm_assessment_results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."asm_assessments"
    ADD CONSTRAINT "asm_assessments_assessment_type_id_fkey" FOREIGN KEY ("assessment_type_id") REFERENCES "public"."asm_types"("assessment_type_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."asm_assessments"
    ADD CONSTRAINT "asm_assessments_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."birth_charts"
    ADD CONSTRAINT "birth_charts_birth_city_id_fkey" FOREIGN KEY ("birth_city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."birth_charts"
    ADD CONSTRAINT "birth_charts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."birth_charts"
    ADD CONSTRAINT "birth_charts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cert_certifications_awarded"
    ADD CONSTRAINT "cert_certifications_awarded_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cert_certifications_awarded"
    ADD CONSTRAINT "cert_certifications_awarded_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chart_interpretations"
    ADD CONSTRAINT "chart_interpretations_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "public"."birth_charts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chart_interpretations"
    ADD CONSTRAINT "chart_interpretations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chart_interpretations"
    ADD CONSTRAINT "chart_interpretations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chart_shares"
    ADD CONSTRAINT "chart_shares_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "public"."birth_charts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chart_shares"
    ADD CONSTRAINT "chart_shares_shared_by_user_id_fkey" FOREIGN KEY ("shared_by_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chart_shares"
    ADD CONSTRAINT "chart_shares_shared_with_user_id_fkey" FOREIGN KEY ("shared_with_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_conversations"
    ADD CONSTRAINT "chat_conversations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_conversations"
    ADD CONSTRAINT "chat_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."com_forum_posts"
    ADD CONSTRAINT "com_forum_posts_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "public"."com_forum_posts"("post_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."com_forum_posts"
    ADD CONSTRAINT "com_forum_posts_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."com_forum_topics"("topic_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."com_forum_topics"
    ADD CONSTRAINT "com_forum_topics_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."com_forum_topics"
    ADD CONSTRAINT "com_forum_topics_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_continent_id_fkey" FOREIGN KEY ("continent_id") REFERENCES "public"."continents"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."cur_exercise_logs"
    ADD CONSTRAINT "cur_exercise_logs_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."cur_practical_exercises"("exercise_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_exercise_logs"
    ADD CONSTRAINT "cur_exercise_logs_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_level_requirements"
    ADD CONSTRAINT "cur_level_requirements_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_months"
    ADD CONSTRAINT "cur_months_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_practical_exercises"
    ADD CONSTRAINT "cur_practical_exercises_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_reading_materials"
    ADD CONSTRAINT "cur_reading_materials_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_session_recordings"
    ADD CONSTRAINT "cur_session_recordings_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."cur_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_sessions"
    ADD CONSTRAINT "cur_sessions_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_topics"
    ADD CONSTRAINT "cur_topics_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_week_resources"
    ADD CONSTRAINT "cur_week_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."res_resources"("resource_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_week_resources"
    ADD CONSTRAINT "cur_week_resources_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cur_weeks"
    ADD CONSTRAINT "cur_weeks_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "public"."cur_months"("month_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fac_assignments"
    ADD CONSTRAINT "fac_assignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."fac_faculty"("faculty_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fac_assignments"
    ADD CONSTRAINT "fac_assignments_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fac_mentor_assignments"
    ADD CONSTRAINT "fac_mentor_assignments_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "public"."fac_faculty"("faculty_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fac_mentor_assignments"
    ADD CONSTRAINT "fac_mentor_assignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fac_mentor_requirements"
    ADD CONSTRAINT "fac_mentor_requirements_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fac_mentorship_sessions"
    ADD CONSTRAINT "fac_mentorship_sessions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."fac_mentor_assignments"("assignment_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lesson_completions"
    ADD CONSTRAINT "lesson_completions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lesson_completions"
    ADD CONSTRAINT "lesson_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_parent_organization_id_fkey" FOREIGN KEY ("parent_organization_id") REFERENCES "public"."organizations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pkg_inclusions"
    ADD CONSTRAINT "pkg_inclusions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."pkg_course_packages"("package_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pkg_pricing_tiers"
    ADD CONSTRAINT "pkg_pricing_tiers_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."pkg_course_packages"("package_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."planetary_positions"
    ADD CONSTRAINT "planetary_positions_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "public"."birth_charts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pranayama_sessions"
    ADD CONSTRAINT "pranayama_sessions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pranayama_sessions"
    ADD CONSTRAINT "pranayama_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_birth_city_id_fkey" FOREIGN KEY ("birth_city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."qa_student_feedback"
    ADD CONSTRAINT "qa_student_feedback_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."stu_enrollments"("enrollment_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."qa_student_feedback"
    ADD CONSTRAINT "qa_student_feedback_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."qa_student_feedback"
    ADD CONSTRAINT "qa_student_feedback_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."res_resources"
    ADD CONSTRAINT "res_resources_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."res_types"("type_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."stu_assessments"
    ADD CONSTRAINT "stu_assessments_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."asm_assessments"("assessment_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_assessments"
    ADD CONSTRAINT "stu_assessments_evaluated_by_fkey" FOREIGN KEY ("evaluated_by") REFERENCES "public"."fac_faculty"("faculty_id");



ALTER TABLE ONLY "public"."stu_assessments"
    ADD CONSTRAINT "stu_assessments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_attendance"
    ADD CONSTRAINT "stu_attendance_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."academy_memberships"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_attendance"
    ADD CONSTRAINT "stu_attendance_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."cur_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_certifications"
    ADD CONSTRAINT "stu_certifications_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_certifications"
    ADD CONSTRAINT "stu_certifications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_enrollments"
    ADD CONSTRAINT "stu_enrollments_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."cur_certification_levels"("level_id");



ALTER TABLE ONLY "public"."stu_enrollments"
    ADD CONSTRAINT "stu_enrollments_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."pkg_course_packages"("package_id");



ALTER TABLE ONLY "public"."stu_enrollments"
    ADD CONSTRAINT "stu_enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_payment_installments"
    ADD CONSTRAINT "stu_payment_installments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."stu_enrollments"("enrollment_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_payments"
    ADD CONSTRAINT "stu_payments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."stu_enrollments"("enrollment_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_progress"
    ADD CONSTRAINT "stu_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."stu_students"("student_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_progress"
    ADD CONSTRAINT "stu_progress_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "public"."cur_weeks"("week_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stu_students"
    ADD CONSTRAINT "stu_students_current_level_id_fkey" FOREIGN KEY ("current_level_id") REFERENCES "public"."cur_certification_levels"("level_id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."topic_to_lesson_mappings"
    ADD CONSTRAINT "topic_to_lesson_mappings_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."topic_to_lesson_mappings"
    ADD CONSTRAINT "topic_to_lesson_mappings_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_birth_data"
    ADD CONSTRAINT "user_birth_data_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_birth_data"
    ADD CONSTRAINT "user_birth_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_themes"
    ADD CONSTRAINT "user_themes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage memberships in their tenant" ON "public"."academy_memberships" USING ((("tenant_id" = "public"."get_current_user_tenant_id"()) AND ("public"."get_current_user_role"() = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"])))) WITH CHECK ((("tenant_id" = "public"."get_current_user_tenant_id"()) AND ("public"."get_current_user_role"() = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"]))));



CREATE POLICY "Admins can manage role permissions" ON "public"."role_permissions" USING ((("tenant_id" = "public"."get_current_user_tenant_id"()) AND ("public"."get_current_user_role"() = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role"]))));



CREATE POLICY "Admins can update user roles and status in their tenant" ON "public"."profiles" FOR UPDATE USING ((("tenant_id" = "public"."get_current_user_tenant_id"()) AND ("public"."get_current_user_role"() = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"])) AND ("id" <> "auth"."uid"())));



CREATE POLICY "Admins can view basic profile info in their tenant" ON "public"."profiles" FOR SELECT USING ((("tenant_id" = "public"."get_current_user_tenant_id"()) AND ("public"."get_current_user_role"() = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"])) AND ("id" <> "auth"."uid"())));



CREATE POLICY "Admins can view memberships in their tenant" ON "public"."academy_memberships" FOR SELECT USING ((("tenant_id" = "public"."get_current_user_tenant_id"()) AND ("public"."get_current_user_role"() = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"]))));



CREATE POLICY "Admins/faculty manage topic mappings" ON "public"."topic_to_lesson_mappings" USING ((COALESCE("public"."get_current_user_role"(), 'end_user'::"public"."user_role") = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"]))) WITH CHECK ((COALESCE("public"."get_current_user_role"(), 'end_user'::"public"."user_role") = ANY (ARRAY['super_admin'::"public"."user_role", 'tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"])));



CREATE POLICY "Allow authenticated users to delete their own mantra session" ON "public"."mantra_sessions" FOR DELETE USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to delete their own meditation sessio" ON "public"."meditation_sessions" FOR DELETE USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to delete their own pranayama session" ON "public"."pranayama_sessions" FOR DELETE USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to insert their own mantra session" ON "public"."mantra_sessions" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to insert their own meditation sessio" ON "public"."meditation_sessions" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to insert their own pranayama session" ON "public"."pranayama_sessions" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to update their own mantra session" ON "public"."mantra_sessions" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to update their own meditation sessio" ON "public"."meditation_sessions" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to update their own pranayama session" ON "public"."pranayama_sessions" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to view their own mantra sessions" ON "public"."mantra_sessions" FOR SELECT USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to view their own meditation sessions" ON "public"."meditation_sessions" FOR SELECT USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow authenticated users to view their own pranayama sessions" ON "public"."pranayama_sessions" FOR SELECT USING ((("auth"."uid"() = "user_id") AND (( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id")));



CREATE POLICY "Allow tenant members to access chat conversations" ON "public"."chat_conversations" USING ((( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "tenant_id"));



CREATE POLICY "Allow tenant members to access chat messages" ON "public"."chat_messages" USING ((( SELECT "chat_conversations"."tenant_id"
   FROM "public"."chat_conversations"
  WHERE ("chat_conversations"."id" = "chat_messages"."conversation_id")) IN ( SELECT "profiles"."tenant_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "Geographic data is publicly readable" ON "public"."cities" FOR SELECT USING (true);



CREATE POLICY "Geographic data is publicly readable" ON "public"."continents" FOR SELECT USING (true);



CREATE POLICY "Geographic data is publicly readable" ON "public"."countries" FOR SELECT USING (true);



CREATE POLICY "Geographic data is publicly readable" ON "public"."states" FOR SELECT USING (true);



CREATE POLICY "Organization admins can manage their organizations" ON "public"."organizations" USING ((("tenant_id" = "public"."get_current_user_tenant_id"()) AND (("public"."get_current_user_role"() = ANY (ARRAY['tenant_admin'::"public"."user_role", 'organization_admin'::"public"."user_role"])) OR ("id" = "public"."get_current_user_organization_id"()))));



CREATE POLICY "Public read topic mappings" ON "public"."topic_to_lesson_mappings" FOR SELECT USING (true);



CREATE POLICY "Super admins can manage all tenants" ON "public"."tenants" USING (("public"."get_current_user_role"() = 'super_admin'::"public"."user_role"));



CREATE POLICY "Super admins can view session metadata" ON "public"."user_sessions" FOR SELECT USING (("public"."get_current_user_role"() = 'super_admin'::"public"."user_role"));



CREATE POLICY "System can insert planetary positions" ON "public"."planetary_positions" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."birth_charts"
  WHERE (("birth_charts"."id" = "planetary_positions"."chart_id") AND ("birth_charts"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create interpretations for their charts" ON "public"."chart_interpretations" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND ("tenant_id" = "public"."get_current_user_tenant_id"())));



CREATE POLICY "Users can create messages in their conversations" ON "public"."chat_messages" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."chat_conversations"
  WHERE (("chat_conversations"."id" = "chat_messages"."conversation_id") AND ("chat_conversations"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can create shares for their charts" ON "public"."chart_shares" FOR INSERT WITH CHECK ((("auth"."uid"() = "shared_by_user_id") AND (EXISTS ( SELECT 1
   FROM "public"."birth_charts"
  WHERE (("birth_charts"."id" = "chart_shares"."chart_id") AND ("birth_charts"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can create their own charts" ON "public"."birth_charts" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND ("tenant_id" = "public"."get_current_user_tenant_id"())));



CREATE POLICY "Users can create their own conversations" ON "public"."chat_conversations" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND ("tenant_id" = "public"."get_current_user_tenant_id"())));



CREATE POLICY "Users can delete their own charts" ON "public"."birth_charts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own themes." ON "public"."user_themes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own themes." ON "public"."user_themes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own birth data" ON "public"."user_birth_data" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update interpretations for their charts" ON "public"."chart_interpretations" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own charts" ON "public"."birth_charts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own conversations" ON "public"."chat_conversations" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can update their own shares" ON "public"."chart_shares" FOR UPDATE USING (("auth"."uid"() = "shared_by_user_id"));



CREATE POLICY "Users can update their own themes." ON "public"."user_themes" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view interpretations for their charts" ON "public"."chart_interpretations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view messages in their conversations" ON "public"."chat_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."chat_conversations"
  WHERE (("chat_conversations"."id" = "chat_messages"."conversation_id") AND ("chat_conversations"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view organizations in their tenant" ON "public"."organizations" FOR SELECT USING (("tenant_id" = "public"."get_current_user_tenant_id"()));



CREATE POLICY "Users can view positions for their charts" ON "public"."planetary_positions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."birth_charts"
  WHERE (("birth_charts"."id" = "planetary_positions"."chart_id") AND ("birth_charts"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view public charts" ON "public"."birth_charts" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Users can view shares they created or received" ON "public"."chart_shares" FOR SELECT USING ((("auth"."uid"() = "shared_by_user_id") OR ("auth"."uid"() = "shared_with_user_id")));



CREATE POLICY "Users can view their own academy memberships" ON "public"."academy_memberships" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own charts" ON "public"."birth_charts" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own conversations" ON "public"."chat_conversations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can view their own session metadata" ON "public"."user_sessions" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own tenant" ON "public"."tenants" FOR SELECT USING (("id" = "public"."get_current_user_tenant_id"()));



CREATE POLICY "Users can view their own themes and system themes" ON "public"."user_themes" FOR SELECT USING ((("auth"."uid"() = "user_id") OR (("user_id" IS NULL) AND ("is_default" = true))));



ALTER TABLE "public"."academy_memberships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."birth_charts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."certificates" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "certificates_read_own" ON "public"."certificates" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."chart_interpretations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chart_shares" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."continents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "courses_read_authenticated" ON "public"."courses" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."cur_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."enrollments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "enrollments_insert_self" ON "public"."enrollments" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "enrollments_read_own" ON "public"."enrollments" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "enrollments_update_self" ON "public"."enrollments" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."lesson_completions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "lesson_completions_insert_self" ON "public"."lesson_completions" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "lesson_completions_read_own" ON "public"."lesson_completions" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "lessons_read_authenticated" ON "public"."lessons" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."mantra_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meditation_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."planetary_positions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pranayama_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."states" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stu_attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."topic_to_lesson_mappings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_birth_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_themes" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_secure_share_token"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_secure_share_token"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_secure_share_token"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_user_organization_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_organization_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_organization_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_user_tenant_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_tenant_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_tenant_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_profile_sensitive_data"("profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profile_sensitive_data"("profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profile_sensitive_data"("profile_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_registration"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_registration"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_registration"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_permission"("resource" "text", "action" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_permission"("resource" "text", "action" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_permission"("resource" "text", "action" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."hash_session_token"("token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hash_session_token"("token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hash_session_token"("token" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."academy_memberships" TO "anon";
GRANT ALL ON TABLE "public"."academy_memberships" TO "authenticated";
GRANT ALL ON TABLE "public"."academy_memberships" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."admin_profile_view" TO "anon";
GRANT ALL ON TABLE "public"."admin_profile_view" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_profile_view" TO "service_role";



GRANT ALL ON TABLE "public"."asm_assessment_results" TO "anon";
GRANT ALL ON TABLE "public"."asm_assessment_results" TO "authenticated";
GRANT ALL ON TABLE "public"."asm_assessment_results" TO "service_role";



GRANT ALL ON SEQUENCE "public"."asm_assessment_results_result_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."asm_assessment_results_result_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."asm_assessment_results_result_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."asm_assessments" TO "anon";
GRANT ALL ON TABLE "public"."asm_assessments" TO "authenticated";
GRANT ALL ON TABLE "public"."asm_assessments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."asm_assessments_assessment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."asm_assessments_assessment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."asm_assessments_assessment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."asm_types" TO "anon";
GRANT ALL ON TABLE "public"."asm_types" TO "authenticated";
GRANT ALL ON TABLE "public"."asm_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."asm_types_assessment_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."asm_types_assessment_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."asm_types_assessment_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."birth_charts" TO "anon";
GRANT ALL ON TABLE "public"."birth_charts" TO "authenticated";
GRANT ALL ON TABLE "public"."birth_charts" TO "service_role";



GRANT ALL ON TABLE "public"."cert_certifications_awarded" TO "anon";
GRANT ALL ON TABLE "public"."cert_certifications_awarded" TO "authenticated";
GRANT ALL ON TABLE "public"."cert_certifications_awarded" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cert_certifications_awarded_award_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cert_certifications_awarded_award_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cert_certifications_awarded_award_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."certificates" TO "anon";
GRANT ALL ON TABLE "public"."certificates" TO "authenticated";
GRANT ALL ON TABLE "public"."certificates" TO "service_role";



GRANT ALL ON TABLE "public"."chart_interpretations" TO "anon";
GRANT ALL ON TABLE "public"."chart_interpretations" TO "authenticated";
GRANT ALL ON TABLE "public"."chart_interpretations" TO "service_role";



GRANT ALL ON TABLE "public"."chart_shares" TO "anon";
GRANT ALL ON TABLE "public"."chart_shares" TO "authenticated";
GRANT ALL ON TABLE "public"."chart_shares" TO "service_role";



GRANT ALL ON TABLE "public"."chat_conversations" TO "anon";
GRANT ALL ON TABLE "public"."chat_conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_conversations" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."cities" TO "anon";
GRANT ALL ON TABLE "public"."cities" TO "authenticated";
GRANT ALL ON TABLE "public"."cities" TO "service_role";



GRANT ALL ON TABLE "public"."com_forum_posts" TO "anon";
GRANT ALL ON TABLE "public"."com_forum_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."com_forum_posts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."com_forum_posts_post_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."com_forum_posts_post_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."com_forum_posts_post_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."com_forum_topics" TO "anon";
GRANT ALL ON TABLE "public"."com_forum_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."com_forum_topics" TO "service_role";



GRANT ALL ON SEQUENCE "public"."com_forum_topics_topic_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."com_forum_topics_topic_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."com_forum_topics_topic_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."continents" TO "anon";
GRANT ALL ON TABLE "public"."continents" TO "authenticated";
GRANT ALL ON TABLE "public"."continents" TO "service_role";



GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."cur_certification_levels" TO "anon";
GRANT ALL ON TABLE "public"."cur_certification_levels" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_certification_levels" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_certification_levels_level_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_certification_levels_level_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_certification_levels_level_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_exercise_logs" TO "anon";
GRANT ALL ON TABLE "public"."cur_exercise_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_exercise_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_exercise_logs_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_exercise_logs_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_exercise_logs_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_level_requirements" TO "anon";
GRANT ALL ON TABLE "public"."cur_level_requirements" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_level_requirements" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_level_requirements_requirement_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_level_requirements_requirement_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_level_requirements_requirement_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_months" TO "anon";
GRANT ALL ON TABLE "public"."cur_months" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_months" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_months_month_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_months_month_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_months_month_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_practical_exercises" TO "anon";
GRANT ALL ON TABLE "public"."cur_practical_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_practical_exercises" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_practical_exercises_exercise_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_practical_exercises_exercise_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_practical_exercises_exercise_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_reading_materials" TO "anon";
GRANT ALL ON TABLE "public"."cur_reading_materials" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_reading_materials" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_reading_materials_material_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_reading_materials_material_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_reading_materials_material_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_session_recordings" TO "anon";
GRANT ALL ON TABLE "public"."cur_session_recordings" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_session_recordings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_session_recordings_recording_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_session_recordings_recording_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_session_recordings_recording_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_sessions" TO "anon";
GRANT ALL ON TABLE "public"."cur_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."cur_topics" TO "anon";
GRANT ALL ON TABLE "public"."cur_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_topics" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_topics_topic_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_topics_topic_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_topics_topic_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_week_resources" TO "anon";
GRANT ALL ON TABLE "public"."cur_week_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_week_resources" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_week_resources_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_week_resources_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_week_resources_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cur_weeks" TO "anon";
GRANT ALL ON TABLE "public"."cur_weeks" TO "authenticated";
GRANT ALL ON TABLE "public"."cur_weeks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cur_weeks_week_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cur_weeks_week_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cur_weeks_week_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."enrollments" TO "anon";
GRANT ALL ON TABLE "public"."enrollments" TO "authenticated";
GRANT ALL ON TABLE "public"."enrollments" TO "service_role";



GRANT ALL ON TABLE "public"."fac_assignments" TO "anon";
GRANT ALL ON TABLE "public"."fac_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."fac_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."fac_faculty" TO "anon";
GRANT ALL ON TABLE "public"."fac_faculty" TO "authenticated";
GRANT ALL ON TABLE "public"."fac_faculty" TO "service_role";



GRANT ALL ON SEQUENCE "public"."fac_faculty_faculty_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."fac_faculty_faculty_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."fac_faculty_faculty_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."fac_mentor_assignments" TO "anon";
GRANT ALL ON TABLE "public"."fac_mentor_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."fac_mentor_assignments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."fac_mentor_assignments_assignment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."fac_mentor_assignments_assignment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."fac_mentor_assignments_assignment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."fac_mentor_requirements" TO "anon";
GRANT ALL ON TABLE "public"."fac_mentor_requirements" TO "authenticated";
GRANT ALL ON TABLE "public"."fac_mentor_requirements" TO "service_role";



GRANT ALL ON SEQUENCE "public"."fac_mentor_requirements_requirement_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."fac_mentor_requirements_requirement_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."fac_mentor_requirements_requirement_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."fac_mentorship_sessions" TO "anon";
GRANT ALL ON TABLE "public"."fac_mentorship_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."fac_mentorship_sessions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."fac_mentorship_sessions_session_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."fac_mentorship_sessions_session_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."fac_mentorship_sessions_session_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."lesson_completions" TO "anon";
GRANT ALL ON TABLE "public"."lesson_completions" TO "authenticated";
GRANT ALL ON TABLE "public"."lesson_completions" TO "service_role";



GRANT ALL ON TABLE "public"."lessons" TO "anon";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
GRANT ALL ON TABLE "public"."lessons" TO "service_role";



GRANT ALL ON TABLE "public"."mantra_sessions" TO "anon";
GRANT ALL ON TABLE "public"."mantra_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."mantra_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."meditation_sessions" TO "anon";
GRANT ALL ON TABLE "public"."meditation_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."meditation_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";



GRANT ALL ON TABLE "public"."pkg_course_packages" TO "anon";
GRANT ALL ON TABLE "public"."pkg_course_packages" TO "authenticated";
GRANT ALL ON TABLE "public"."pkg_course_packages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pkg_course_packages_package_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pkg_course_packages_package_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pkg_course_packages_package_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pkg_inclusions" TO "anon";
GRANT ALL ON TABLE "public"."pkg_inclusions" TO "authenticated";
GRANT ALL ON TABLE "public"."pkg_inclusions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pkg_inclusions_inclusion_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pkg_inclusions_inclusion_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pkg_inclusions_inclusion_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pkg_pricing_tiers" TO "anon";
GRANT ALL ON TABLE "public"."pkg_pricing_tiers" TO "authenticated";
GRANT ALL ON TABLE "public"."pkg_pricing_tiers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pkg_pricing_tiers_tier_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pkg_pricing_tiers_tier_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pkg_pricing_tiers_tier_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."planetary_positions" TO "anon";
GRANT ALL ON TABLE "public"."planetary_positions" TO "authenticated";
GRANT ALL ON TABLE "public"."planetary_positions" TO "service_role";



GRANT ALL ON TABLE "public"."pranayama_sessions" TO "anon";
GRANT ALL ON TABLE "public"."pranayama_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."pranayama_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."qa_student_feedback" TO "anon";
GRANT ALL ON TABLE "public"."qa_student_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."qa_student_feedback" TO "service_role";



GRANT ALL ON SEQUENCE "public"."qa_student_feedback_feedback_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."qa_student_feedback_feedback_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."qa_student_feedback_feedback_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."res_resources" TO "anon";
GRANT ALL ON TABLE "public"."res_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."res_resources" TO "service_role";



GRANT ALL ON SEQUENCE "public"."res_resources_resource_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."res_resources_resource_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."res_resources_resource_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."res_types" TO "anon";
GRANT ALL ON TABLE "public"."res_types" TO "authenticated";
GRANT ALL ON TABLE "public"."res_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."res_types_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."res_types_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."res_types_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."states" TO "anon";
GRANT ALL ON TABLE "public"."states" TO "authenticated";
GRANT ALL ON TABLE "public"."states" TO "service_role";



GRANT ALL ON TABLE "public"."stu_assessments" TO "anon";
GRANT ALL ON TABLE "public"."stu_assessments" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_assessments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stu_assessments_student_assessment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stu_assessments_student_assessment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stu_assessments_student_assessment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stu_attendance" TO "anon";
GRANT ALL ON TABLE "public"."stu_attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_attendance" TO "service_role";



GRANT ALL ON TABLE "public"."stu_certifications" TO "anon";
GRANT ALL ON TABLE "public"."stu_certifications" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_certifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stu_certifications_certification_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stu_certifications_certification_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stu_certifications_certification_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stu_enrollments" TO "anon";
GRANT ALL ON TABLE "public"."stu_enrollments" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_enrollments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stu_enrollments_enrollment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stu_enrollments_enrollment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stu_enrollments_enrollment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stu_payment_installments" TO "anon";
GRANT ALL ON TABLE "public"."stu_payment_installments" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_payment_installments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stu_payment_installments_installment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stu_payment_installments_installment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stu_payment_installments_installment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stu_payments" TO "anon";
GRANT ALL ON TABLE "public"."stu_payments" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_payments" TO "service_role";



GRANT ALL ON TABLE "public"."stu_progress" TO "anon";
GRANT ALL ON TABLE "public"."stu_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_progress" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stu_progress_progress_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stu_progress_progress_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stu_progress_progress_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stu_students" TO "anon";
GRANT ALL ON TABLE "public"."stu_students" TO "authenticated";
GRANT ALL ON TABLE "public"."stu_students" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stu_students_student_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stu_students_student_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stu_students_student_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tenants" TO "anon";
GRANT ALL ON TABLE "public"."tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."tenants" TO "service_role";



GRANT ALL ON TABLE "public"."topic_to_lesson_mappings" TO "anon";
GRANT ALL ON TABLE "public"."topic_to_lesson_mappings" TO "authenticated";
GRANT ALL ON TABLE "public"."topic_to_lesson_mappings" TO "service_role";



GRANT ALL ON TABLE "public"."user_birth_data" TO "anon";
GRANT ALL ON TABLE "public"."user_birth_data" TO "authenticated";
GRANT ALL ON TABLE "public"."user_birth_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_birth_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_birth_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_birth_data_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "anon";
GRANT ALL ON TABLE "public"."user_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."user_themes" TO "anon";
GRANT ALL ON TABLE "public"."user_themes" TO "authenticated";
GRANT ALL ON TABLE "public"."user_themes" TO "service_role";



GRANT ALL ON TABLE "public"."vw_active_students_progress" TO "anon";
GRANT ALL ON TABLE "public"."vw_active_students_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_active_students_progress" TO "service_role";



GRANT ALL ON TABLE "public"."vw_curriculum_outline" TO "anon";
GRANT ALL ON TABLE "public"."vw_curriculum_outline" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_curriculum_outline" TO "service_role";



GRANT ALL ON TABLE "public"."vw_faculty_week_load" TO "anon";
GRANT ALL ON TABLE "public"."vw_faculty_week_load" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_faculty_week_load" TO "service_role";



GRANT ALL ON TABLE "public"."vw_revenue_analysis" TO "anon";
GRANT ALL ON TABLE "public"."vw_revenue_analysis" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_revenue_analysis" TO "service_role";



GRANT ALL ON TABLE "public"."vw_student_enrollment_overview" TO "anon";
GRANT ALL ON TABLE "public"."vw_student_enrollment_overview" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_student_enrollment_overview" TO "service_role";



GRANT ALL ON TABLE "public"."vw_student_performance_metrics" TO "anon";
GRANT ALL ON TABLE "public"."vw_student_performance_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_student_performance_metrics" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







RESET ALL;
