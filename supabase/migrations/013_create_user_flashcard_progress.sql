-- Tabla user_flashcard_progress: progreso de flashcards con SM-2 spaced repetition
CREATE TABLE user_flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  flashcard_id UUID NOT NULL REFERENCES flashcards(id),
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_seen TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  ease_factor NUMERIC(3,2) DEFAULT 2.5,
  UNIQUE(user_id, flashcard_id)
);

CREATE INDEX idx_flashcard_progress_review ON user_flashcard_progress(user_id, next_review)
  WHERE next_review IS NOT NULL;
