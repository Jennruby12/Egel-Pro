-- =====================================================================
-- FASE 6 (prep) — Aislamiento de progreso por examen (ADITIVO).
-- Añade un índice único (user_id, exam_id, area, subarea) para que el progreso
-- sea por examen. Es backward-compatible: con un solo examen (ISOFT) coexiste
-- con la única antigua (user_id, area, subarea), así que el código de prod
-- (`main`) que aún hace onConflict sobre la antigua sigue funcionando.
--
-- NOTA para el futuro: ANTES de sembrar/activar un 2º examen con preguntas hay
-- que DROP de la única antigua `user_progress_user_id_area_subarea_key` (o como
-- se llame), porque impediría tener (area,subarea) repetidos entre exámenes.
-- =====================================================================
create unique index if not exists user_progress_user_exam_area_subarea_key
  on public.user_progress (user_id, exam_id, area, subarea);
