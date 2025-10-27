-- Add view: vw_active_students_progress
BEGIN;

-- Create a consolidated progress view for active students.
-- Avoids ORDER BY in subqueries; uses aggregates for last activity.
CREATE OR REPLACE VIEW public.vw_active_students_progress AS
SELECT
  s.student_id,
  s.first_name,
  s.last_name,
  s.email,
  s.current_level_id AS level_id,
  l.level_name,
  e.enrollment_id,
  e.status AS enrollment_status,
  e.payment_status,
  -- Total weeks in the enrolled level
  (
    SELECT COUNT(*)
    FROM public.cur_weeks w
    JOIN public.cur_months m ON m.month_id = w.month_id
    WHERE m.level_id = e.level_id
  ) AS weeks_total,
  -- Aggregated progress counts
  COALESCE(SUM(CASE WHEN sp.status = 'Completed' THEN 1 ELSE 0 END), 0) AS weeks_completed,
  COALESCE(SUM(CASE WHEN sp.status = 'In Progress' THEN 1 ELSE 0 END), 0) AS weeks_in_progress,
  -- Average completion percentage across tracked weeks
  COALESCE(ROUND(AVG(sp.completion_percentage)::numeric, 2), 0) AS avg_completion_percentage,
  -- Last activity timestamp from progress
  MAX(COALESCE(sp.completed_date::timestamp, sp.started_date::timestamp)) AS last_activity_at
FROM public.stu_students s
LEFT JOIN public.stu_enrollments e ON e.student_id = s.student_id
LEFT JOIN public.cur_certification_levels l ON l.level_id = e.level_id
LEFT JOIN public.stu_progress sp ON sp.student_id = s.student_id
WHERE s.is_active = TRUE
GROUP BY
  s.student_id, s.first_name, s.last_name, s.email, s.current_level_id,
  l.level_name, e.enrollment_id, e.status, e.payment_status;

COMMIT;