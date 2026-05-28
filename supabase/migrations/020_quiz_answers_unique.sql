-- Unique constraint para permitir upsert de respuestas (cambiar respuesta
-- mientras la sesion sigue in_progress)
ALTER TABLE quiz_answers
  ADD CONSTRAINT quiz_answers_session_question_unique
  UNIQUE (session_id, question_id);
