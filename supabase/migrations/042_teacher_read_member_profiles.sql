-- ADITIVO: el maestro (owner de un grupo) puede leer el perfil de sus alumnos
-- (nombre/email) para mostrarlos en su panel. Política SELECT nueva; no toca las
-- existentes. Usa is_teacher_of() (SECURITY DEFINER) para evitar recursión RLS.
drop policy if exists group_teachers_read_member_profiles on public.profiles;
create policy group_teachers_read_member_profiles on public.profiles for select
  using (public.is_teacher_of(id));
