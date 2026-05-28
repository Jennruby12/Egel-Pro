-- Tabla user_progress: precision acumulada por area/subarea
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  area INTEGER NOT NULL,
  subarea INTEGER NOT NULL,
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  accuracy_percent NUMERIC(5,2) DEFAULT 0,
  mastery_level TEXT DEFAULT 'untouched'
    CHECK (mastery_level IN ('untouched','learning','familiar','mastered')),
  last_practiced TIMESTAMPTZ,
  UNIQUE(user_id, area, subarea)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
