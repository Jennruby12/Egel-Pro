-- Tabla questions: banco de preguntas del examen EGEL
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Clasificacion oficial CENEVAL
  section TEXT NOT NULL CHECK (section IN ('disciplinar','transversal')),
  area INTEGER NOT NULL CHECK (area BETWEEN 1 AND 4),
  area_name TEXT NOT NULL,
  subarea INTEGER NOT NULL CHECK (subarea BETWEEN 1 AND 5),
  subarea_name TEXT NOT NULL,
  -- Contenido
  type TEXT NOT NULL DEFAULT 'single'
    CHECK (type IN ('single','multireactivo')),
  stimulus_id UUID REFERENCES stimuli(id),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('a','b','c')),
  explanation TEXT,
  image_url TEXT,
  -- Metadata
  difficulty TEXT DEFAULT 'medium'
    CHECK (difficulty IN ('easy','medium','hard')),
  tags TEXT[] DEFAULT '{}',
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  -- Flags
  is_active BOOLEAN DEFAULT TRUE,
  is_pilot BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_active_area_sub ON questions(is_active, is_deleted, area, subarea)
  WHERE is_active = TRUE AND is_deleted = FALSE;
CREATE INDEX idx_questions_section ON questions(section);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
