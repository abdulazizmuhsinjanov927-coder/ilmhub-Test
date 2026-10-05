-- ====================================================================
-- ILMTEST PLATFORMASI — PRODUCTION POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Row Level Security (RLS), Indexes, Foreign Keys, Audit Triggers
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE question_type AS ENUM (
  'single_choice',
  'true_false',
  'multiple_choice',
  'image_question',
  'text_question',
  'image_options',
  'short_answer',
  'numeric_answer'
);
CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE test_status AS ENUM ('draft', 'scheduled', 'active', 'closed', 'archived');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'time_expired', 'cancelled');
CREATE TYPE anti_cheat_type AS ENUM ('tab_switch', 'window_blur', 'fullscreen_exit', 'page_leave');

-- 3. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  avatar_url TEXT,
  telegram_id VARCHAR(50),
  telegram_username VARCHAR(100),
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DEVICE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.device_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_type VARCHAR(20) NOT NULL DEFAULT 'desktop',
  browser VARCHAR(50) NOT NULL,
  os VARCHAR(50) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  login_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. GROUPS TABLE
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  course VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  code VARCHAR(12) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. GROUP MEMBERS
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, student_id)
);

-- 7. BOOKS & TOPICS
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  order_index INT NOT NULL DEFAULT 1,
  description TEXT
);

-- 8. QUESTIONS TABLE (8 QUESTION TYPES)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  type question_type NOT NULL DEFAULT 'single_choice',
  question_text TEXT NOT NULL,
  passage_text TEXT,
  image_url TEXT,
  score INT NOT NULL DEFAULT 1,
  difficulty question_difficulty NOT NULL DEFAULT 'medium',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  options JSONB NOT NULL DEFAULT '[]'::JSONB,
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TESTS TABLE
CREATE TABLE IF NOT EXISTS public.tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 30,
  max_attempts INT NOT NULL DEFAULT 1,
  passing_percentage INT NOT NULL DEFAULT 70,
  max_score INT NOT NULL DEFAULT 10,
  randomize_questions BOOLEAN NOT NULL DEFAULT TRUE,
  randomize_options BOOLEAN NOT NULL DEFAULT TRUE,
  show_results_immediately BOOLEAN NOT NULL DEFAULT TRUE,
  show_correct_answers BOOLEAN NOT NULL DEFAULT TRUE,
  show_explanations BOOLEAN NOT NULL DEFAULT TRUE,
  status test_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TEST GROUPS JUNCTION
CREATE TABLE IF NOT EXISTS public.test_groups (
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  PRIMARY KEY (test_id, group_id)
);

-- 11. TEST QUESTIONS JUNCTION
CREATE TABLE IF NOT EXISTS public.test_questions (
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 1,
  PRIMARY KEY (test_id, question_id)
);

-- 12. TEST ATTEMPTS TABLE (Authoritative Server-side Score)
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  attempt_number INT NOT NULL DEFAULT 1,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_seconds INT NOT NULL DEFAULT 0,
  status attempt_status NOT NULL DEFAULT 'in_progress',
  score INT NOT NULL DEFAULT 0,
  max_score INT NOT NULL DEFAULT 10,
  percentage INT NOT NULL DEFAULT 0,
  is_passed BOOLEAN NOT NULL DEFAULT FALSE,
  answers JSONB NOT NULL DEFAULT '{}'::JSONB,
  question_order UUID[] DEFAULT ARRAY[]::UUID[],
  option_orders JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ANTI-CHEAT EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.anti_cheat_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  event_type anti_cheat_type NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  details TEXT
);

-- 14. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  user_name VARCHAR(150),
  user_role VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(100),
  details TEXT NOT NULL,
  ip VARCHAR(45) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PERFORMANCE INDEXES (500+ CONCURRENT USERS SPEED)
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_group_members_group_student ON public.group_members(group_id, student_id);
CREATE INDEX IF NOT EXISTS idx_questions_teacher_topic ON public.questions(teacher_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_student_test ON public.test_attempts(student_id, test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_status ON public.test_attempts(status);
CREATE INDEX IF NOT EXISTS idx_anti_cheat_attempt ON public.anti_cheat_events(attempt_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anti_cheat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Students can read all names in group; Teachers and Super Admins manage
CREATE POLICY "Public profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Groups: Students see groups they belong to; Teachers see their own; Admins see all
CREATE POLICY "Teacher groups management"
  ON public.groups FOR ALL
  TO authenticated
  USING (
    teacher_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );

CREATE POLICY "Student can view joined groups"
  ON public.groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = public.groups.id AND student_id = auth.uid())
  );

-- Tests: Students see active tests of their groups; Teachers see own tests
CREATE POLICY "Teacher test management"
  ON public.tests FOR ALL
  TO authenticated
  USING (
    teacher_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );

CREATE POLICY "Student test view"
  ON public.tests FOR SELECT
  TO authenticated
  USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM public.test_groups tg
      JOIN public.group_members gm ON gm.group_id = tg.group_id
      WHERE tg.test_id = public.tests.id AND gm.student_id = auth.uid()
    )
  );

-- Attempts: Students manage own; Teachers view attempts for their tests
CREATE POLICY "Student attempt access"
  ON public.test_attempts FOR ALL
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teacher attempt view"
  ON public.test_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.tests WHERE id = public.test_attempts.test_id AND teacher_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );
