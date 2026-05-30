-- Marker migration: el banco fue migrado al CSV LIMPIO con 1238 preguntas
-- curadas (formato EGEL real). Las 93 preguntas viejas que no estaban en el CSV
-- quedan en DB con is_active=false, is_deleted=true para preservar el historico
-- de quiz_answers (FK).
--
-- Script ejecutado: scripts/import-csv-bank.mjs --apply
-- Fuente: .claude/docs/egelpro-banco-preguntas-2026-05-30-LIMPIO.xlsx
--
-- Antes:  916 activas / 916 fisicas
-- Despues: 1238 activas / 1331 fisicas (93 soft-deleted)
--
-- Estimulos: 19 referenciados, 9 ya existian, 10 nuevos placeholder creados.
-- Editar el body de los placeholder despues en /admin/stimuli o via SQL.

-- (Esta migration es solo marcador documental. La data ya fue aplicada vivo.)
SELECT 1;
