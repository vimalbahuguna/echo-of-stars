-- Vedic Academy: Financial Management domain
BEGIN;

-- Payment Installments per enrollment
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'installment_status_enum') THEN
    CREATE TYPE public.installment_status_enum AS ENUM ('pending','paid','overdue');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.stu_payment_installments (
  installment_id BIGSERIAL PRIMARY KEY,
  enrollment_id BIGINT NOT NULL REFERENCES public.stu_enrollments(enrollment_id) ON DELETE CASCADE,
  installment_number SMALLINT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status public.installment_status_enum NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id, installment_number)
);
CREATE INDEX IF NOT EXISTS idx_installments_enrollment ON public.stu_payment_installments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_installments_due_date ON public.stu_payment_installments(due_date);

COMMIT;