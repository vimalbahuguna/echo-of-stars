-- Vedic Academy: Comprehensive seed data for remote deployment
BEGIN;

-- 1) Certification Levels
INSERT INTO public.cur_certification_levels (level_name, level_type, duration_months, duration_weeks, duration_days, sequence_order, passing_score_percentage, fee_usd, description)
VALUES
  ('Foundation Level', 'Foundation', 3, 12, 84, 1, 60.00, 500.00, 'Introductory study of core Vedic principles'),
  ('Practitioner Level', 'Practitioner', 4, 16, 112, 2, 65.00, 800.00, 'Applied practice and intermediate techniques'),
  ('Professional Level', 'Professional', 6, 24, 168, 3, 70.00, 1500.00, 'Advanced methods and case study analysis')
ON CONFLICT ON CONSTRAINT uk_level_type DO NOTHING;

-- 2) Months per Level
WITH l AS (
  SELECT level_id, level_type FROM public.cur_certification_levels
  WHERE level_type IN ('Foundation','Practitioner','Professional')
)
INSERT INTO public.cur_months (level_id, month_number, month_title, description)
SELECT level_id, mnum, mt, description
FROM (
  VALUES
    ('Foundation'::public.cur_level_type_enum, 1, 'Foundations Month 1', 'Core concepts and orientation'),
    ('Foundation'::public.cur_level_type_enum, 2, 'Foundations Month 2', 'Fundamentals of practice'),
    ('Foundation'::public.cur_level_type_enum, 3, 'Foundations Month 3', 'Intro assessments and reflection'),
    ('Practitioner'::public.cur_level_type_enum, 1, 'Practitioner Month 1', 'Intermediate methods part 1'),
    ('Practitioner'::public.cur_level_type_enum, 2, 'Practitioner Month 2', 'Intermediate methods part 2'),
    ('Practitioner'::public.cur_level_type_enum, 3, 'Practitioner Month 3', 'Applied practice and logs'),
    ('Practitioner'::public.cur_level_type_enum, 4, 'Practitioner Month 4', 'Integration and preparation'),
    ('Professional'::public.cur_level_type_enum, 1, 'Professional Month 1', 'Advanced techniques part 1'),
    ('Professional'::public.cur_level_type_enum, 2, 'Professional Month 2', 'Advanced techniques part 2'),
    ('Professional'::public.cur_level_type_enum, 3, 'Professional Month 3', 'Case studies part 1'),
    ('Professional'::public.cur_level_type_enum, 4, 'Professional Month 4', 'Case studies part 2'),
    ('Professional'::public.cur_level_type_enum, 5, 'Professional Month 5', 'Specializations'),
    ('Professional'::public.cur_level_type_enum, 6, 'Professional Month 6', 'Final project and review')
  ) AS v(level_type, mnum, mt, description)
JOIN l ON l.level_type = v.level_type
ON CONFLICT (level_id, month_number) DO NOTHING;

-- 3) Weeks for each inserted month (4 weeks per month)
WITH m AS (
  SELECT month_id FROM public.cur_months
),
weeks AS (
  SELECT month_id, 1 AS week_start, 1 AS week_end, 'Week 1: Orientation' AS week_title, 6.0 AS theory_hours, 4.0 AS practical_hours, 4.0 AS self_study_hours
  FROM m
  UNION ALL
  SELECT month_id, 2, 2, 'Week 2: Building Blocks', 6.0, 5.0, 4.0 FROM m
  UNION ALL
  SELECT month_id, 3, 3, 'Week 3: Techniques', 7.0, 5.0, 4.0 FROM m
  UNION ALL
  SELECT month_id, 4, 4, 'Week 4: Integration', 6.0, 6.0, 4.0 FROM m
)
INSERT INTO public.cur_weeks (month_id, week_start, week_end, week_title, theory_hours, practical_hours, self_study_hours, description)
SELECT w.month_id, w.week_start, w.week_end, w.week_title, w.theory_hours, w.practical_hours, w.self_study_hours, 'Auto-seeded week'
FROM weeks w
WHERE NOT EXISTS (
  SELECT 1 FROM public.cur_weeks cw
  WHERE cw.month_id = w.month_id AND cw.week_start = w.week_start AND cw.week_end = w.week_end
);

-- 4) Topics per week (3 topics)
WITH w AS (
  SELECT week_id, week_title FROM public.cur_weeks
), t AS (
  SELECT week_id, 1 AS topic_order, 'Topic A: Core Reading' AS topic_title, 'Concepts and definitions' AS topic_description, TRUE AS is_core_topic FROM w
  UNION ALL
  SELECT week_id, 2, 'Topic B: Practice Routine', 'Guided practice with logs', TRUE FROM w
  UNION ALL
  SELECT week_id, 3, 'Topic C: Reflection & Q&A', 'Review, questions, and feedback', TRUE FROM w
)
INSERT INTO public.cur_topics (week_id, topic_title, topic_order, topic_description, is_core_topic)
SELECT week_id, topic_title, topic_order, topic_description, is_core_topic
FROM t
WHERE NOT EXISTS (
  SELECT 1 FROM public.cur_topics ct
  WHERE ct.week_id = t.week_id AND ct.topic_order = t.topic_order AND ct.topic_title = t.topic_title
);

-- 5) Practical exercises per week (2 exercises)
WITH w AS (
  SELECT week_id FROM public.cur_weeks
), e AS (
  SELECT week_id, 1 AS exercise_order, 'Exercise 1: Breath Awareness' AS exercise_title, 'Observe and log breath cycles' AS exercise_description, 1.0 AS estimated_duration_hours, 'Beginner'::public.cur_difficulty_level_enum AS difficulty_level FROM w
  UNION ALL
  SELECT week_id, 2, 'Exercise 2: Mantra Practice', '10-minute mantra repetition with focus' AS exercise_description, 1.0, 'Beginner'::public.cur_difficulty_level_enum FROM w
)
INSERT INTO public.cur_practical_exercises (week_id, exercise_title, exercise_description, exercise_order, estimated_duration_hours, difficulty_level)
SELECT week_id, exercise_title, exercise_description, exercise_order, estimated_duration_hours, difficulty_level
FROM e
WHERE NOT EXISTS (
  SELECT 1 FROM public.cur_practical_exercises ce
  WHERE ce.week_id = e.week_id AND ce.exercise_order = e.exercise_order AND ce.exercise_title = e.exercise_title
);

-- 6) Assessment types and assessments per level
INSERT INTO public.asm_types (type_name, description)
VALUES ('Quiz', 'Short theory quiz'), ('Practical', 'Hands-on practical assessment'), ('Final Exam', 'Comprehensive final exam')
ON CONFLICT ON CONSTRAINT uk_type_name DO NOTHING;

WITH l AS (
  SELECT level_id, level_type, level_name FROM public.cur_certification_levels
  WHERE level_type IN ('Foundation','Practitioner','Professional')
), t AS (
  SELECT assessment_type_id, type_name FROM public.asm_types
), asms AS (
  SELECT l.level_id, t.assessment_type_id, format('%s %s', l.level_name, t.type_name) AS assessment_name, 2.0::NUMERIC AS duration_hours, 100 AS max_marks, 1 AS quantity, format('Assessment for %s', t.type_name) AS description
  FROM l CROSS JOIN t
)
INSERT INTO public.asm_assessments (level_id, assessment_type_id, assessment_name, duration_hours, max_marks, quantity, description)
SELECT level_id, assessment_type_id, assessment_name, duration_hours, max_marks, quantity, description
FROM asms
WHERE NOT EXISTS (
  SELECT 1 FROM public.asm_assessments aa WHERE aa.level_id = asms.level_id AND aa.assessment_name = asms.assessment_name
);

-- 7) Packages & inclusions & pricing tiers
INSERT INTO public.pkg_course_packages (package_name, package_type, total_fee_usd, duration_months, hours_per_week, savings_usd, payment_plan_available, payment_installments, description, is_active)
VALUES
  ('Complete Path', 'Complete', 2500.00, 12, 8, 200.00, TRUE, 10, 'All levels with support', TRUE),
  ('Level-by-Level', 'Level-by-Level', 1500.00, 6, 6, 0.00, TRUE, 6, 'Enroll per level sequentially', TRUE),
  ('Fast-Track', 'Fast-Track', 1800.00, 6, 10, 100.00, TRUE, 8, 'Accelerated path for experienced learners', TRUE)
ON CONFLICT ON CONSTRAINT uk_package_type DO NOTHING;

-- Inclusions
WITH p AS (
  SELECT package_id, package_type FROM public.pkg_course_packages
), inc AS (
  SELECT package_id, 'Weekly Live Session' AS inclusion_item, 1 AS inclusion_order FROM p WHERE package_type = 'Complete'
  UNION ALL SELECT package_id, 'Mentorship Support', 2 FROM p WHERE package_type = 'Complete'
  UNION ALL SELECT package_id, 'Assessment Access', 3 FROM p WHERE package_type = 'Complete'
  UNION ALL SELECT package_id, 'Assessment Access', 1 FROM p WHERE package_type = 'Level-by-Level'
  UNION ALL SELECT package_id, 'Community Forum', 2 FROM p WHERE package_type = 'Level-by-Level'
  UNION ALL SELECT package_id, 'Accelerated Coaching', 1 FROM p WHERE package_type = 'Fast-Track'
)
INSERT INTO public.pkg_inclusions (package_id, inclusion_item, inclusion_order)
SELECT package_id, inclusion_item, inclusion_order FROM inc
WHERE NOT EXISTS (
  SELECT 1 FROM public.pkg_inclusions pi WHERE pi.package_id = inc.package_id AND pi.inclusion_item = inc.inclusion_item
);

-- Pricing tiers
WITH p AS (
  SELECT package_id, package_type FROM public.pkg_course_packages
), tiers AS (
  SELECT package_id, 'Standard' AS tier_name, 0.00::NUMERIC AS price_usd, 'Included in package' AS description FROM p
)
INSERT INTO public.pkg_pricing_tiers (package_id, tier_name, price_usd, description)
SELECT package_id, tier_name, price_usd, description FROM tiers
ON CONFLICT (package_id, tier_name) DO NOTHING;

-- 8) Faculty
INSERT INTO public.fac_faculty (first_name, last_name, email, phone, years_of_experience, specialization, bio, is_lead_faculty, traditional_lineage)
VALUES
  ('Asha', 'Gupta', 'asha.gupta@vedic.academy', '+1-555-1111', 12, 'Vedic Philosophy', 'Lead educator in traditional texts', TRUE, 'Advaita'),
  ('Ravi', 'Iyer', 'ravi.iyer@vedic.academy', '+1-555-2222', 8, 'Pranayama', 'Breath work specialist', FALSE, 'Kriya'),
  ('Meera', 'Desai', 'meera.desai@vedic.academy', '+1-555-3333', 6, 'Mantra', 'Sound and mantra practices', FALSE, 'Bhakti')
ON CONFLICT (email) DO NOTHING;

-- 9) Students
INSERT INTO public.stu_students (first_name, last_name, email, phone, whatsapp, country, enrollment_date, current_level_id, sos_astro_account_id)
SELECT * FROM (
  VALUES
    ('Arjun','Shah','arjun.shah@student.vedic','+1-555-7001','+1-555-7001','USA', CURRENT_DATE - INTERVAL '45 days', (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Foundation'), 'acct_001'),
    ('Kavya','Menon','kavya.menon@student.vedic','+1-555-7002','+1-555-7002','India', CURRENT_DATE - INTERVAL '30 days', (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Foundation'), 'acct_002'),
    ('Neel','Patel','neel.patel@student.vedic','+1-555-7003','+1-555-7003','UK', CURRENT_DATE - INTERVAL '20 days', (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Practitioner'), 'acct_003'),
    ('Anya','Kapoor','anya.kapoor@student.vedic','+1-555-7004','+1-555-7004','USA', CURRENT_DATE - INTERVAL '10 days', (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Practitioner'), 'acct_004'),
    ('Rohan','Jain','rohan.jain@student.vedic','+1-555-7005','+1-555-7005','Canada', CURRENT_DATE - INTERVAL '5 days', (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Professional'), 'acct_005')
) AS v(first_name,last_name,email,phone,whatsapp,country,enrollment_date,current_level_id,sos_astro_account_id)
ON CONFLICT (email) DO NOTHING;

-- 10) Enrollments
WITH s AS (
  SELECT student_id, email FROM public.stu_students
), p AS (
  SELECT package_id, package_type FROM public.pkg_course_packages
), l AS (
  SELECT level_id, level_type FROM public.cur_certification_levels
)
INSERT INTO public.stu_enrollments (student_id, package_id, level_id, enrollment_date, start_date, expected_completion_date, status, payment_status)
SELECT
  (SELECT student_id FROM s WHERE email='arjun.shah@student.vedic'), (SELECT package_id FROM p WHERE package_type='Complete'), (SELECT level_id FROM l WHERE level_type='Foundation'), CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '44 days', CURRENT_DATE + INTERVAL '45 days', 'In Progress', 'Partial'
WHERE NOT EXISTS (
  SELECT 1 FROM public.stu_enrollments e WHERE e.student_id = (SELECT student_id FROM s WHERE email='arjun.shah@student.vedic') AND e.level_id = (SELECT level_id FROM l WHERE level_type='Foundation')
);

WITH s AS (
  SELECT student_id, email FROM public.stu_students
), p AS (
  SELECT package_id, package_type FROM public.pkg_course_packages
), l AS (
  SELECT level_id, level_type FROM public.cur_certification_levels
)
INSERT INTO public.stu_enrollments (student_id, package_id, level_id, enrollment_date, start_date, expected_completion_date, status, payment_status)
SELECT
  (SELECT student_id FROM s WHERE email='kavya.menon@student.vedic'), (SELECT package_id FROM p WHERE package_type='Level-by-Level'), (SELECT level_id FROM l WHERE level_type='Foundation'), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE + INTERVAL '60 days', 'Enrolled', 'Pending'
WHERE NOT EXISTS (
  SELECT 1 FROM public.stu_enrollments e WHERE e.student_id = (SELECT student_id FROM s WHERE email='kavya.menon@student.vedic') AND e.level_id = (SELECT level_id FROM l WHERE level_type='Foundation')
);

WITH s AS (
  SELECT student_id, email FROM public.stu_students
), p AS (
  SELECT package_id, package_type FROM public.pkg_course_packages
), l AS (
  SELECT level_id, level_type FROM public.cur_certification_levels
)
INSERT INTO public.stu_enrollments (student_id, package_id, level_id, enrollment_date, start_date, expected_completion_date, status, payment_status)
SELECT
  (SELECT student_id FROM s WHERE email='neel.patel@student.vedic'), (SELECT package_id FROM p WHERE package_type='Level-by-Level'), (SELECT level_id FROM l WHERE level_type='Practitioner'), CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '19 days', CURRENT_DATE + INTERVAL '80 days', 'In Progress', 'Pending'
WHERE NOT EXISTS (
  SELECT 1 FROM public.stu_enrollments e WHERE e.student_id = (SELECT student_id FROM s WHERE email='neel.patel@student.vedic') AND e.level_id = (SELECT level_id FROM l WHERE level_type='Practitioner')
);

WITH s AS (
  SELECT student_id, email FROM public.stu_students
), p AS (
  SELECT package_id, package_type FROM public.pkg_course_packages
), l AS (
  SELECT level_id, level_type FROM public.cur_certification_levels
)
INSERT INTO public.stu_enrollments (student_id, package_id, level_id, enrollment_date, start_date, expected_completion_date, status, payment_status)
SELECT
  (SELECT student_id FROM s WHERE email='anya.kapoor@student.vedic'), (SELECT package_id FROM p WHERE package_type='Fast-Track'), (SELECT level_id FROM l WHERE level_type='Practitioner'), CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '9 days', CURRENT_DATE + INTERVAL '90 days', 'Enrolled', 'Pending'
WHERE NOT EXISTS (
  SELECT 1 FROM public.stu_enrollments e WHERE e.student_id = (SELECT student_id FROM s WHERE email='anya.kapoor@student.vedic') AND e.level_id = (SELECT level_id FROM l WHERE level_type='Practitioner')
);

WITH s AS (
  SELECT student_id, email FROM public.stu_students
), p AS (
  SELECT package_id, package_type FROM public.pkg_course_packages
), l AS (
  SELECT level_id, level_type FROM public.cur_certification_levels
)
INSERT INTO public.stu_enrollments (student_id, package_id, level_id, enrollment_date, start_date, expected_completion_date, status, payment_status)
SELECT
  (SELECT student_id FROM s WHERE email='rohan.jain@student.vedic'), (SELECT package_id FROM p WHERE package_type='Fast-Track'), (SELECT level_id FROM l WHERE level_type='Professional'), CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '120 days', 'Enrolled', 'Pending'
WHERE NOT EXISTS (
  SELECT 1 FROM public.stu_enrollments e WHERE e.student_id = (SELECT student_id FROM s WHERE email='rohan.jain@student.vedic') AND e.level_id = (SELECT level_id FROM l WHERE level_type='Professional')
);

-- 11) Progress for first week of Foundation
WITH w AS (
  SELECT w.week_id FROM public.cur_weeks w
  JOIN public.cur_months m ON m.month_id = w.month_id
  JOIN public.cur_certification_levels l ON l.level_id = m.level_id
  WHERE l.level_type = 'Foundation' AND w.week_start = 1
), s AS (
  SELECT student_id, email FROM public.stu_students WHERE email IN ('arjun.shah@student.vedic','kavya.menon@student.vedic')
)
INSERT INTO public.stu_progress (student_id, week_id, completion_percentage, status, started_date)
SELECT s.student_id, (SELECT week_id FROM w LIMIT 1), 25.00, 'In Progress', CURRENT_DATE - INTERVAL '20 days'
FROM s
ON CONFLICT (student_id, week_id) DO NOTHING;

-- 12) Assessment results for Foundation Quiz
WITH a AS (
  SELECT aa.assessment_id FROM public.asm_assessments aa
  JOIN public.cur_certification_levels l ON l.level_id = aa.level_id AND l.level_type = 'Foundation'
  JOIN public.asm_types t ON t.assessment_type_id = aa.assessment_type_id AND t.type_name = 'Quiz'
), s AS (
  SELECT student_id, email FROM public.stu_students WHERE email IN ('arjun.shah@student.vedic','kavya.menon@student.vedic')
)
INSERT INTO public.asm_assessment_results (assessment_id, student_id, score, passed, graded_at, grader_faculty_id)
SELECT (SELECT assessment_id FROM a), s.student_id, 72.5, TRUE, now() - INTERVAL '1 day', (SELECT faculty_id FROM public.fac_faculty WHERE email='asha.gupta@vedic.academy')
FROM s
ON CONFLICT (assessment_id, student_id) DO NOTHING;

-- 13) Certifications awarded for Foundation (to Arjun only)
INSERT INTO public.cert_certifications_awarded (student_id, level_id, certificate_code, status, awarded_at, notes)
SELECT
  (SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic'),
  (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Foundation'),
  'CERT-FND-0001', 'awarded', now(), 'Auto-awarded on passing quiz'
ON CONFLICT (student_id, level_id) DO NOTHING;

-- 14) Payments and Installments
WITH e AS (
  SELECT enrollment_id, student_id FROM public.stu_enrollments
  WHERE student_id = (SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic')
)
INSERT INTO public.stu_payment_installments (enrollment_id, installment_number, amount_usd, due_date, paid_date, status, notes)
SELECT e.enrollment_id, 1, 250.00, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '14 days', 'paid', 'First installment paid'
FROM e
ON CONFLICT (enrollment_id, installment_number) DO NOTHING;

WITH e AS (
  SELECT enrollment_id, student_id FROM public.stu_enrollments
  WHERE student_id = (SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic')
)
INSERT INTO public.stu_payment_installments (enrollment_id, installment_number, amount_usd, due_date, paid_date, status, notes)
SELECT e.enrollment_id, 2, 250.00, CURRENT_DATE + INTERVAL '15 days', NULL, 'pending', 'Second installment pending'
FROM e
ON CONFLICT (enrollment_id, installment_number) DO NOTHING;

-- 15) Mentor assignments and sessions
WITH m AS (
  SELECT faculty_id FROM public.fac_faculty WHERE email='ravi.iyer@vedic.academy'
), s AS (
  SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic'
)
INSERT INTO public.fac_mentor_assignments (mentor_id, student_id, start_date, active, notes)
SELECT (SELECT faculty_id FROM m), (SELECT student_id FROM s), CURRENT_DATE - INTERVAL '14 days', TRUE, 'Assigned for breath practice mentoring'
ON CONFLICT (mentor_id, student_id, start_date) DO NOTHING;

INSERT INTO public.fac_mentorship_sessions (assignment_id, session_at, duration_minutes, recording_url, notes)
SELECT a.assignment_id, now() - INTERVAL '7 days', 45, 'https://example.com/recordings/session1.mp4', 'Intro coaching session'
FROM public.fac_mentor_assignments a
WHERE a.mentor_id = (SELECT faculty_id FROM public.fac_faculty WHERE email='ravi.iyer@vedic.academy')
  AND a.student_id = (SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic')
  AND NOT EXISTS (
    SELECT 1 FROM public.fac_mentorship_sessions s2 WHERE s2.assignment_id = a.assignment_id AND s2.session_at::date = (now() - INTERVAL '7 days')::date
  );

-- 16) Faculty assignments to weeks
WITH w AS (
  SELECT w.week_id FROM public.cur_weeks w
  JOIN public.cur_months m ON m.month_id = w.month_id
  JOIN public.cur_certification_levels l ON l.level_id = m.level_id
  WHERE l.level_type = 'Foundation' AND w.week_start = 1
)
INSERT INTO public.fac_assignments (faculty_id, week_id, role, assigned_at)
SELECT (SELECT faculty_id FROM public.fac_faculty WHERE email='asha.gupta@vedic.academy'), (SELECT week_id FROM w LIMIT 1), 'instructor', now()
ON CONFLICT (faculty_id, week_id) DO NOTHING;

-- 17) Reading materials
WITH w AS (
  SELECT w.week_id FROM public.cur_weeks w
  JOIN public.cur_months m ON m.month_id = w.month_id
  JOIN public.cur_certification_levels l ON l.level_id = m.level_id
  WHERE l.level_type = 'Foundation' AND w.week_start = 1
)
INSERT INTO public.cur_reading_materials (week_id, title, url, kind, added_at)
SELECT (SELECT week_id FROM w LIMIT 1), 'Intro to Vedic Foundations', 'https://example.com/docs/vedic-foundations.pdf', 'pdf', now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.cur_reading_materials r WHERE r.week_id = (SELECT week_id FROM w LIMIT 1) AND r.title = 'Intro to Vedic Foundations'
);

-- 18) Learning resources and week-resource mapping
-- Resource types are inserted in migrations; insert a few resources
-- Ensure resource types exist
INSERT INTO public.res_types (type_name)
SELECT v.type_name
FROM (VALUES ('video'), ('document')) AS v(type_name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.res_types rt WHERE rt.type_name = v.type_name
);

WITH t AS (
  SELECT type_id, type_name FROM public.res_types
), ins AS (
  SELECT (SELECT type_id FROM t WHERE type_name='video') AS type_id, 'Breath Awareness Session' AS title, 'Guided breath awareness video' AS description, 'https://example.com/videos/breath-awareness.mp4' AS url, 25 AS duration_minutes, '{"level":"foundation"}'::jsonb AS metadata
  UNION ALL
  SELECT (SELECT type_id FROM t WHERE type_name='document'), 'Mantra Practice Guide', 'Step-by-step mantra practice' AS description, 'https://example.com/docs/mantra-guide.pdf', 12, '{"level":"foundation"}'::jsonb
)
INSERT INTO public.res_resources (type_id, title, description, url, duration_minutes, metadata)
SELECT type_id, title, description, url, duration_minutes, metadata FROM ins
WHERE NOT EXISTS (
  SELECT 1 FROM public.res_resources r WHERE r.title = ins.title
);

-- Map resources to first foundation week
WITH w AS (
  SELECT w.week_id FROM public.cur_weeks w
  JOIN public.cur_months m ON m.month_id = w.month_id
  JOIN public.cur_certification_levels l ON l.level_id = m.level_id
  WHERE l.level_type = 'Foundation' AND w.week_start = 1
), r AS (
  SELECT resource_id FROM public.res_resources WHERE title IN ('Breath Awareness Session','Mantra Practice Guide')
)
INSERT INTO public.cur_week_resources (week_id, resource_id, ordering)
SELECT (SELECT week_id FROM w LIMIT 1), r.resource_id, ROW_NUMBER() OVER ()
FROM r
ON CONFLICT (week_id, resource_id) DO NOTHING;

-- 19) Sessions and recordings
WITH w AS (
  SELECT w.week_id FROM public.cur_weeks w
  JOIN public.cur_months m ON m.month_id = w.month_id
  JOIN public.cur_certification_levels l ON l.level_id = m.level_id
  WHERE l.level_type = 'Foundation' AND w.week_start = 1
), s AS (
  INSERT INTO public.cur_sessions (week_id, title, description, start_at, end_at)
  SELECT (SELECT week_id FROM w LIMIT 1), 'Foundation Live - Week 1', 'Kickoff and orientation', now() - INTERVAL '8 days', (now() - INTERVAL '8 days') + INTERVAL '90 minutes'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.cur_sessions cs WHERE cs.week_id = (SELECT week_id FROM w LIMIT 1) AND cs.title = 'Foundation Live - Week 1'
  )
  RETURNING id
)
INSERT INTO public.cur_session_recordings (session_id, url, duration_minutes)
SELECT id, 'https://example.com/recordings/foundation-week1.mp4', 90 FROM s
ON CONFLICT DO NOTHING;

-- 20) Forum topics and posts
INSERT INTO public.com_forum_topics (title, description, level_id, week_id, created_by)
SELECT 'Welcome: Introductions', 'Share your goals and background',
  (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Foundation'),
  (SELECT w.week_id FROM public.cur_weeks w JOIN public.cur_months m ON m.month_id = w.month_id JOIN public.cur_certification_levels l ON l.level_id = m.level_id WHERE l.level_type='Foundation' AND w.week_start=1 LIMIT 1),
  NULL
WHERE NOT EXISTS (SELECT 1 FROM public.com_forum_topics t WHERE t.title = 'Welcome: Introductions');

INSERT INTO public.com_forum_posts (topic_id, author_membership_id, content)
SELECT t.topic_id, NULL::uuid, 'Namaste! Looking forward to learning together.'
FROM public.com_forum_topics t WHERE t.title = 'Welcome: Introductions'
AND NOT EXISTS (
  SELECT 1 FROM public.com_forum_posts p WHERE p.topic_id = t.topic_id AND p.content = 'Namaste! Looking forward to learning together.'
);

-- 21) QA Feedback
INSERT INTO public.qa_student_feedback (student_id, enrollment_id, level_id, rating_content, rating_instructor, rating_support, rating_overall, comments)
SELECT
  (SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic'),
  (SELECT enrollment_id FROM public.stu_enrollments WHERE student_id = (SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic') LIMIT 1),
  (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Foundation'),
  5, 5, 4, 5, 'Great orientation week!'
WHERE NOT EXISTS (
  SELECT 1 FROM public.qa_student_feedback q WHERE q.student_id = (SELECT student_id FROM public.stu_students WHERE email='arjun.shah@student.vedic') AND q.level_id = (SELECT level_id FROM public.cur_certification_levels WHERE level_type='Foundation')
);

COMMIT;
