-- Tabla question_feedback: feedback de CALIDAD / dificultad percibida por el
-- usuario sobre una pregunta (ej. "respuestas muy obvias", "muy facil").
-- Es DISTINTO de question_reports (que es para reportar errores). Sirve para
-- detectar, con la senal de usuarios reales, preguntas flojas o a revisar.

CREATE TABLE IF NOT EXISTS public.question_feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL CHECK (reason IN (
                'respuestas_obvias', 'muy_facil', 'confusa', 'mal_redactada', 'desactualizada'
              )),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  -- Un usuario marca cada razon una sola vez por pregunta (toggle, no infla el contador)
  UNIQUE (user_id, question_id, reason)
);

CREATE INDEX IF NOT EXISTS idx_question_feedback_question ON public.question_feedback(question_id, reason);
CREATE INDEX IF NOT EXISTS idx_question_feedback_user ON public.question_feedback(user_id);

ALTER TABLE public.question_feedback ENABLE ROW LEVEL SECURITY;

-- El usuario gestiona solo su propio feedback
CREATE POLICY "qf_select_own" ON public.question_feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "qf_insert_own" ON public.question_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "qf_delete_own" ON public.question_feedback
  FOR DELETE USING (auth.uid() = user_id);

-- Admin: lectura total (sin recursion, via la funcion SECURITY DEFINER is_admin())
CREATE POLICY "qf_admin_read" ON public.question_feedback
  FOR SELECT USING (public.is_admin());

-- RPC agregado para el panel admin: el "contador" por pregunta y razon.
-- SECURITY DEFINER + guard is_admin() para que solo admins reciban filas.
CREATE OR REPLACE FUNCTION public.question_feedback_counts()
RETURNS TABLE (
  question_id        UUID,
  question_text      TEXT,
  area               INTEGER,
  total              BIGINT,
  respuestas_obvias  BIGINT,
  muy_facil          BIGINT,
  confusa            BIGINT,
  mal_redactada      BIGINT,
  desactualizada     BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    q.id,
    q.question_text,
    q.area,
    COUNT(f.*)                                                AS total,
    COUNT(*) FILTER (WHERE f.reason = 'respuestas_obvias')    AS respuestas_obvias,
    COUNT(*) FILTER (WHERE f.reason = 'muy_facil')            AS muy_facil,
    COUNT(*) FILTER (WHERE f.reason = 'confusa')              AS confusa,
    COUNT(*) FILTER (WHERE f.reason = 'mal_redactada')        AS mal_redactada,
    COUNT(*) FILTER (WHERE f.reason = 'desactualizada')       AS desactualizada
  FROM public.question_feedback f
  JOIN public.questions q ON q.id = f.question_id
  WHERE public.is_admin()
  GROUP BY q.id, q.question_text, q.area
  ORDER BY COUNT(f.*) DESC;
$$;
