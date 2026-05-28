-- 021_simulacro_group_id.sql
-- Agrega columna para agrupar las dos sesiones de un simulacro completo (full_simulacro).
-- Cada simulacro genera dos filas en quiz_sessions (session_number 1 y 2) que comparten
-- el mismo simulacro_group_id. Permite retomar el flujo entre sesiones y mostrar
-- resultados combinados al finalizar.
ALTER TABLE quiz_sessions ADD COLUMN simulacro_group_id UUID;
CREATE INDEX idx_quiz_sessions_simulacro_group ON quiz_sessions(simulacro_group_id) WHERE simulacro_group_id IS NOT NULL;
