# SOS Vedic Academy — Module Redesign (v1.0)

Reference: `Resources/SOS VEDIC ACADEMY-Requirement.txt` and current Postgres/Supabase schema.

## Goals
- Unify curriculum, enrollment, progress, assessments, faculty, resources, payments, communication, quality, and platform tools into a cohesive LMS.
- Align strictly to existing tables/views and Supabase patterns (RLS, RPC, Edge Functions).
- Deliver fast dashboards (target < 3s), scale to 5,000+ active students.

## Information Architecture
- Areas: `CUR`, `STU`, `ASM`, `FAC`, `RES`, `PAY`, `COM`, `CAR`, `PLT`, `QUA`.
- Global navigation: `Dashboard`, `Curriculum`, `Resources`, `Assessments`, `Sessions`, `Forum`, `Payments`, `Quality`, `Admin`.
- Roles: `student`, `faculty`, `lead_faculty`, `tenant_admin`, `organization_admin`, `super_admin`, `guest`.

## Data Model Alignment
- Curriculum: `cur_certification_levels`, `cur_months`, `cur_weeks`, `cur_topics`, `cur_practical_exercises`, `cur_sessions`.
- Students/Enrollment/Progress: `stu_students`, `stu_enrollments`, `stu_progress`.
- Assessments: `asm_assessments`, `asm_assessment_results`, `asm_types`.
- Faculty & Assignments: `fac_faculty`, `fac_assignments`, `academy_memberships`.
- Resources: `res_resources` with `resource_type_id`, `description`.
- Payments: `pkg_course_packages`, `pkg_pricing_tiers`, `stu_payment_installments`, `stu_payments`.
- Communication: `com_forum_topics` (posts table present remotely), `cur_sessions`, `stu_attendance`.
- Quality: `qa_student_feedback`.
- Reporting views: `vw_active_students_progress`, `vw_student_enrollment_overview`, `vw_faculty_week_load`, `vw_curriculum_outline`, `vw_revenue_analysis`, `vw_student_performance_metrics`.

## Access & Security (RLS)
- Enable RLS on user-data tables (`cur_sessions`, `stu_attendance` already enabled). Extend to:
  - `stu_progress`: students `SELECT` own rows; faculty/admin `SELECT` by assignment; writes via RPC only.
  - `qa_student_feedback`: students `INSERT` own; admin `SELECT` aggregates; no public updates.
  - `res_resources`: `SELECT` gated by enrollment/package and progress unlocks.
- Helper functions: `get_current_user_tenant_id()`, `get_current_user_role()`, `get_current_user_organization_id()` used in policies.
- Trusted writes via `service_role` or Edge Functions to maintain integrity.

## Frontend Structure (React)
- Dashboards
  - Student (`src/pages/VedicStudentDashboard.tsx`)
    - KPIs from `vw_active_students_progress`: `weeks_total`, `weeks_completed`, `weeks_in_progress`, `avg_completion_percentage`, `last_activity_at`.
    - Widgets: Current level, upcoming `cur_sessions`, `asm_assessments`, `res_resources`, payments.
  - Faculty (`src/pages/VedicFacultyDashboard.tsx`)
    - Data from `vw_faculty_week_load`, `asm_assessment_results` pending, mentorship sessions, attendance.
  - Admin (`src/pages/VedicAdminDashboard.tsx`)
    - Enrollment overview (`vw_student_enrollment_overview`), revenue (`vw_revenue_analysis`), quality (`qa_student_feedback`), faculty load.
- Curriculum (`src/pages/VedicAcademyHome.tsx`)
  - Hierarchy: Level → Month → Week → Topics/Exercises via `vw_curriculum_outline`.
  - Week detail includes resources, exercises, assessments, session links.
- Resources (`src/components/academy/ResourcesBrowser.tsx`)
  - Filter by level/week/topic; premium gating and progress-based unlocks.
- Assessments (`src/components/academy/AssessmentsPanel.tsx`)
  - Student attempts, scores; faculty evaluation workflow.
- Sessions & Attendance (`src/components/academy/SessionsPanel.tsx`)
  - Calendar view; attendance marking; notes.
- Payments (`src/components/academy/PaymentsPanel.tsx`)
  - Installments list (`stu_payment_installments`), invoices, reminders.
- Forum (`src/components/academy/ForumPanel.tsx`)
  - Topics and posts; pin/lock; replies.
- Quality (`src/components/academy/QualityFeedback.tsx`)
  - Feedback form; analytics summary for admins.
- Platform Tools (`src/components/academy/PlatformTools.tsx`)
  - Integrates `BirthChartCalculator`, `EphemerisViewer`, `GuidedMeditationPlayer`, etc.

## Backend & Supabase
- Views
  - Progress: `public.vw_active_students_progress` (aggregates for `weeks_total`, completion, `last_activity_at`).
  - Revenue: `public.vw_revenue_analysis` (monthly sums by status).
  - Curriculum: `public.vw_curriculum_outline` for navigation.
- RPC / Edge Functions (`supabase/functions`)
  - `progress/update_week`
    - Input: `student_id`, `week_id`, `status`, `completion_percentage`, `date`.
    - Behavior: upsert into `stu_progress`; enforce role checks.
  - `assessments/submit_result`
    - Input: `student_id`, `assessment_id`, `score`, `attempt_number`, `evaluator_id`.
    - Behavior: insert into `asm_assessment_results`; update aggregates.
  - `payments/webhook`
    - Stripe/PayPal/Razorpay: create `stu_payments`, update `stu_payment_installments` `status`.
  - `attendance/mark`
    - Input: `session_id`, `membership_id`, `status`, `notes`; writes to `stu_attendance`.
  - `quality/submit_feedback`
    - Input: `student_id`, `enrollment_id`, `level_id`, ratings, `comments`; inserts into `qa_student_feedback`.

## API Contracts (Examples)
- `POST /rpc/progress/update_week`
  - Body: `{ "student_id": number, "week_id": number, "completion_percentage": number, "status": "Not Started"|"In Progress"|"Completed"|"Skipped", "date": "YYYY-MM-DD" }`
  - Returns: `{ "ok": true }` or error.
- `POST /rpc/assessments/submit_result`
  - Body: `{ "student_id": number, "assessment_id": number, "score": number, "attempt_number": number, "evaluator_id": number }`
  - Returns: `{ "ok": true }`.
- `POST /functions/payments/webhook`
  - Body: gateway payload; verifies signature; maps to `enrollment_id`, updates installments.

## Reporting & Analytics
- Student progress: use `vw_active_students_progress` with filters (level, cohort, date).
- Faculty performance: correlate `vw_faculty_week_load` with results and feedback.
- Financial: `vw_revenue_analysis` by month and package.
- Quality: Aggregations over `qa_student_feedback` (content, instructor, support, overall).

## Mobile & Performance
- Responsive layouts; offline caching for resources; background sync for progress.
- CDN for resource delivery; pagination for lists; use views to reduce join cost.
- Target metrics: dashboards < 3s, outline load < 2s, API < 500ms.

## Implementation Plan (Phases)
1) Foundation (Weeks 1–2)
   - Wire dashboards to views; implement `progress/update_week`, `attendance/mark` RPC.
   - Add/confirm RLS for `stu_progress`, `qa_student_feedback`, `stu_attendance`.
2) Learning & Assessment (Weeks 3–4)
   - Curriculum browser with week detail; assessment submission & evaluation.
3) Communication & Mentorship (Weeks 5–6)
   - Sessions calendar, attendance; forum topics/posts; mentor assignment screens.
4) Finance (Weeks 7–8)
   - Payments installments, invoices, webhook integrations; revenue reports.
5) Quality & Optimization (Weeks 9–10)
   - Feedback forms; analytics dashboards; view tuning/materialized views as needed.
6) Scale & Mobile (Weeks 11+)
   - Mobile optimizations; performance profiling; accessibility; internationalization.

## Acceptance Criteria
- Student dashboard shows accurate progress from `vw_active_students_progress`.
- Admin revenue chart reflects monthly paid/pending amounts from `vw_revenue_analysis`.
- RLS prevents unauthorized reads/writes; RPCs enforce role-based updates.
- Feedback capture and reporting available; latency targets met in staging.

## Next Actions
- Implement student dashboard data fetch and render KPIs.
- Stub `progress/update_week` RPC and integrate with week detail page.
- Define missing RLS policies and test with realistic roles.
- Build admin reporting slices for enrollment and revenue.

---
Document owner: Product/Tech. Version 1.0 (Oct 27, 2025). Keep updated with schema and feature changes.