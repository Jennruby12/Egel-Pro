-- Tabla quiz_sessions: sesiones de quiz/simulacro
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  mode TEXT NOT NULL CHECK (mode IN (
    'practice','quick_exam','full_simulacro',
    'review','speed_challenge','daily_challenge'
  )),
  session_number INTEGER DEFAULT 1,
  -- Configuracion
  areas INTEGER[] DEFAULT '{}',
  subareas INTEGER[] DEFAULT '{}',
  total_questions INTEGER NOT NULL,
  time_limit_seconds INTEGER,
  -- Resultados
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  skipped INTEGER DEFAULT 0,
  score_percent NUMERIC(5,2),
  time_taken_seconds INTEGER,
  estimated_level TEXT
    CHECK (estimated_level IN ('ans','satisfactorio','sobresaliente')),
  -- Estado
  status TEXT DEFAULT 'in_progress'
    CHECK (status IN ('in_progress','completed','abandoned')),
  last_question_index INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  -- Meta
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  CONSTRAINT valid_session_number CHECK (session_number IN (1,2))
);

CREATE INDEX idx_quiz_sessions_user_status ON quiz_sessions(user_id, status, started_at DESC);
CREATE INDEX idx_quiz_sessions_mode ON quiz_sessions(mode);
