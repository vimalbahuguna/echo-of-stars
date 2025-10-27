-- Vedic Academy: Quality Assurance and Reporting Views
BEGIN;

-- Student feedback across multiple dimensions
CREATE TABLE IF NOT EXISTS public.qa_student_feedback (
  feedback_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  enrollment_id BIGINT REFERENCES public.stu_enrollments(enrollment_id) ON DELETE SET NULL,
  level_id BIGINT REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  rating_content SMALLINT CHECK (rating_content BETWEEN 1 AND 5),
  rating_instructor SMALLINT CHECK (rating_instructor BETWEEN 1 AND 5),
  rating_support SMALLINT CHECK (rating_support BETWEEN 1 AND 5),
  rating_overall SMALLINT CHECK (rating_overall BETWEEN 1 AND 5),
  comments TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_feedback_student ON public.qa_student_feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_level ON public.qa_student_feedback(level_id);

-- Reporting Views
CREATE OR REPLACE VIEW public.vw_active_students_progress AS
SELECT e.enrollment_id,
       e.student_id,
       s.first_name,
       s.last_name,
       e.level_id,
       l.level_name,
       e.status,
       e.enrollment_date,
       p.status AS payment_status,
       sp.status AS progress_status
FROM public.stu_enrollments e
JOIN public.stu_students s ON s.student_id = e.student_id
LEFT JOIN public.cur_certification_levels l ON l.level_id = e.level_id
LEFT JOIN public.stu_payments p ON p.enrollment_id = e.enrollment_id
LEFT JOIN public.stu_progress sp ON sp.student_id = e.student_id AND sp.level_id = e.level_id
WHERE e.status IN ('Active','In Progress');

CREATE OR REPLACE VIEW public.vw_student_performance_metrics AS
SELECT s.student_id,
       s.first_name,
       s.last_name,
       l.level_name,
       COUNT(ar.result_id) AS assessments_taken,
       AVG(ar.score) AS avg_score,
       SUM(CASE WHEN ar.passed THEN 1 ELSE 0 END) AS passed_count
FROM public.stu_students s
JOIN public.stu_enrollments e ON e.student_id = s.student_id
LEFT JOIN public.cur_certification_levels l ON l.level_id = e.level_id
LEFT JOIN public.asm_assessment_results ar ON ar.student_id = s.student_id AND ar.assessment_id IN (
  SELECT assessment_id FROM public.asm_assessments WHERE level_id = e.level_id
)
GROUP BY s.student_id, s.first_name, s.last_name, l.level_name;

CREATE OR REPLACE VIEW public.vw_revenue_analysis AS
SELECT date_trunc('month', COALESCE(i.paid_date::timestamp, i.due_date::timestamp)) AS month,
       SUM(i.amount_usd) FILTER (WHERE i.status = 'paid') AS paid_amount,
       SUM(i.amount_usd) FILTER (WHERE i.status = 'pending') AS pending_amount,
       COUNT(*) AS installment_count
FROM public.stu_payment_installments i
GROUP BY 1
ORDER BY 1;

COMMIT;