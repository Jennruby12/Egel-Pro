-- =====================================================================
-- FASE 7 — Invitación pública de grupo por código (ADITIVO).
-- Permite mostrar "Te invitan al grupo X" en /join/[code] ANTES de iniciar
-- sesión, sin exponer la tabla groups. Solo devuelve nombre + examen + estado.
-- =====================================================================
create or replace function public.group_public_by_code(p_code text)
returns table (name text, exam_name text, is_active boolean)
language sql security definer set search_path = public stable as $$
  select g.name, e.name as exam_name, g.is_active
  from public.groups g
  join public.exams e on e.id = g.exam_id
  where upper(g.join_code) = upper(btrim(p_code))
  limit 1;
$$;

grant execute on function public.group_public_by_code(text) to anon, authenticated;
