-- Tabla streaks: actividad diaria del usuario
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  daily_challenge_completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, date)
);

CREATE INDEX idx_streaks_user_date ON streaks(user_id, date DESC);
