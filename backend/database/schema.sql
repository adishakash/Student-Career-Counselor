-- =====================================================
-- Student Career Counselor — PostgreSQL Schema
-- Run: psql -d student_career_counselor -f schema.sql
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. students
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  age           SMALLINT,
  standard      VARCHAR(50),           -- e.g. "10th", "11th Science", "12th Commerce"
  phone         VARCHAR(20),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- ─────────────────────────────────────────────
-- 2. assessments
-- One student can take multiple assessments over time
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  plan_type         VARCHAR(10) NOT NULL CHECK (plan_type IN ('free', 'paid')),
  status            VARCHAR(20) NOT NULL DEFAULT 'intake'
                      CHECK (status IN ('intake', 'payment_pending', 'in_progress', 'completed', 'failed')),
  payment_status    VARCHAR(20) NOT NULL DEFAULT 'not_required'
                      CHECK (payment_status IN ('not_required', 'pending', 'paid', 'failed', 'refunded')),
  language          VARCHAR(5) NOT NULL DEFAULT 'en'
                      CHECK (language IN ('en', 'hi')),
  started_at        TIMESTAMPTZ DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- ─────────────────────────────────────────────
-- 3. questions
-- Questions generated per assessment (by LLM or static bank)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  question_type   VARCHAR(20) NOT NULL DEFAULT 'single_choice'
                    CHECK (question_type IN ('single_choice', 'multi_choice', 'scale', 'text')),
  options         JSONB,                -- Array of {value, label} objects
  category        VARCHAR(50),          -- 'interests', 'skills', 'personality', 'goals', 'academics'
  order_index     SMALLINT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON questions(assessment_id);

-- ─────────────────────────────────────────────
-- 4. answers
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text     TEXT,
  answer_value    JSONB,                -- Raw answer (string, array, number)
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (assessment_id, question_id)   -- one answer per question per assessment
);

CREATE INDEX IF NOT EXISTS idx_answers_assessment_id ON answers(assessment_id);

-- ─────────────────────────────────────────────
-- 5. payments
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id         UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id            UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  razorpay_order_id     VARCHAR(255) UNIQUE NOT NULL,
  razorpay_payment_id   VARCHAR(255),
  razorpay_signature    TEXT,
  amount                INTEGER NOT NULL,         -- in paise (₹499 = 49900)
  currency              VARCHAR(3) NOT NULL DEFAULT 'INR',
  status                VARCHAR(20) NOT NULL DEFAULT 'created'
                          CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
  payment_type          VARCHAR(20) NOT NULL DEFAULT 'new'
                          CHECK (payment_type IN ('new', 'upgrade')),
  metadata              JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_assessment_id ON payments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);

-- ─────────────────────────────────────────────
-- 6. reports
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  report_type     VARCHAR(10) NOT NULL CHECK (report_type IN ('free', 'paid')),
  content         JSONB,                -- Structured report data from LLM
  pdf_path        VARCHAR(500),         -- Relative path: pdfs/filename.pdf
  pdf_filename    VARCHAR(255),
  generated_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_assessment_id ON reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_reports_student_id ON reports(student_id);

-- ─────────────────────────────────────────────
-- 7. upgrade_tokens
-- Signed tokens embedded in free PDF upgrade links
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upgrade_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assessment_id   UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  token_hash      VARCHAR(500) UNIQUE NOT NULL,   -- stored as SHA-256 hash of token
  used            BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at      TIMESTAMPTZ NOT NULL,
  used_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_upgrade_tokens_token_hash ON upgrade_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_upgrade_tokens_assessment_id ON upgrade_tokens(assessment_id);

-- ─────────────────────────────────────────────
-- Migrations
-- ─────────────────────────────────────────────
-- Add language column to assessments if it doesn't exist
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS language VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi'));

-- ─────────────────────────────────────────────
-- 8. email_logs
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES students(id) ON DELETE SET NULL,
  assessment_id   UUID REFERENCES assessments(id) ON DELETE SET NULL,
  email_to        VARCHAR(255) NOT NULL,
  email_type      VARCHAR(50) NOT NULL,   -- 'free_report', 'paid_report', 'resend', 'payment_confirm'
  status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  message_id      VARCHAR(255),
  error_message   TEXT,
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_student_id ON email_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_to ON email_logs(email_to);

-- ─────────────────────────────────────────────
-- 9. llm_logs
-- Track LLM usage for debugging and cost monitoring
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS llm_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id     UUID REFERENCES assessments(id) ON DELETE SET NULL,
  provider          VARCHAR(50),          -- 'openai', 'anthropic', 'gemini', 'static'
  prompt_type       VARCHAR(50),          -- 'generate_questions', 'generate_report'
  prompt_tokens     INTEGER,
  completion_tokens INTEGER,
  total_tokens      INTEGER,
  status            VARCHAR(20) NOT NULL  CHECK (status IN ('success', 'error', 'fallback')),
  error_message     TEXT,
  duration_ms       INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_llm_logs_assessment_id ON llm_logs(assessment_id);

-- ─────────────────────────────────────────────
-- 10. Trigger: auto-update updated_at columns
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_students
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_assessments
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ─────────────────────────────────────────────
-- Migration: add language column to assessments
-- Safe to run on existing databases (idempotent)
-- ─────────────────────────────────────────────
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS language VARCHAR(5) NOT NULL DEFAULT 'en'
    CHECK (language IN ('en', 'hi'));
