-- Almacenar los question_ids exactos seleccionados al crear la sesion.
-- Esto permite que al reabrir la sesion se devuelvan LAS MISMAS preguntas
-- en el MISMO orden — no un shuffle nuevo cada vez (bug que reiniciaba el quiz).

ALTER TABLE public.quiz_sessions
  ADD COLUMN IF NOT EXISTS question_ids UUID[] DEFAULT NULL;
