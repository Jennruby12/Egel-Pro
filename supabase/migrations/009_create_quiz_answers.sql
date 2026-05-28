-- Tabla quiz_answers: respuestas por sesion
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  user_answer TEXT CHECK (user_answer IN ('a','b','c')),
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  order_in_quiz INTEGER NOT NULL,
  is_marked BOOLEAN DEFAULT FALSE,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id, order_in_quiz);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);
