-- =====================================================================
-- FASE 4 — Maestro (autoservicio) + Grupos B2C (ADITIVO / backward-compatible)
-- Tablas NUEVAS + políticas NUEVAS. No se tocan políticas existentes.
-- prod (main) no usa estas tablas → sigue idéntico.
-- =====================================================================

-- 1) Ampliar el rol de plataforma con 'teacher' (aditivo) ----------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role = any (array['student','teacher','admin']));

-- 2) Grupos --------------------------------------------------------------
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  name text not null,
  join_code text not null unique,
  is_active boolean not null default true,
  created_at timestamptz default now()
);
create index if not exists idx_groups_owner on public.groups(owner_id);
create index if not exists idx_groups_join_code on public.groups(join_code);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'student' check (role in ('student','teacher')),
  joined_at timestamptz default now(),
  unique (group_id, user_id)
);
create index if not exists idx_group_members_group on public.group_members(group_id);
create index if not exists idx_group_members_user on public.group_members(user_id);

-- 3) Helpers SECURITY DEFINER (evitan recursión de RLS entre tablas) ------
create or replace function public.is_group_owner(gid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.groups where id = gid and owner_id = auth.uid());
$$;

create or replace function public.is_group_member(gid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.group_members where group_id = gid and user_id = auth.uid());
$$;

-- ¿auth.uid() es maestro (owner de algún grupo) del usuario member_id?
create or replace function public.is_teacher_of(member_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1
    from public.groups g
    join public.group_members gm on gm.group_id = g.id
    where g.owner_id = auth.uid() and gm.user_id = member_id
  );
$$;

-- 4) RLS de las tablas nuevas -------------------------------------------
alter table public.groups enable row level security;
alter table public.group_members enable row level security;

-- groups: dueño gestiona lo suyo; miembro lo lee; admin todo.
drop policy if exists groups_owner_all on public.groups;
create policy groups_owner_all on public.groups for all
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());
drop policy if exists groups_member_read on public.groups;
create policy groups_member_read on public.groups for select
  using (public.is_group_member(id));

-- group_members: el usuario ve/sale de las suyas; el dueño del grupo gestiona; admin todo.
drop policy if exists group_members_self_read on public.group_members;
create policy group_members_self_read on public.group_members for select
  using (user_id = auth.uid() or public.is_group_owner(group_id) or public.is_admin());
drop policy if exists group_members_owner_manage on public.group_members;
create policy group_members_owner_manage on public.group_members for all
  using (public.is_group_owner(group_id) or public.is_admin())
  with check (public.is_group_owner(group_id) or public.is_admin());
drop policy if exists group_members_self_leave on public.group_members;
create policy group_members_self_leave on public.group_members for delete
  using (user_id = auth.uid());

-- 5) Maestro lee progreso/sesiones de SUS alumnos (políticas SELECT nuevas) -
drop policy if exists group_teachers_read_member_progress on public.user_progress;
create policy group_teachers_read_member_progress on public.user_progress for select
  using (public.is_teacher_of(user_id));

drop policy if exists group_teachers_read_member_sessions on public.quiz_sessions;
create policy group_teachers_read_member_sessions on public.quiz_sessions for select
  using (public.is_teacher_of(user_id));

-- 6) Unirse a un grupo por código sin exponer la tabla -------------------
create or replace function public.join_group_by_code(p_code text)
returns table (group_id uuid, exam_id uuid, group_name text)
language plpgsql security definer set search_path = public as $$
declare
  g record;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  select id, exam_id, name into g
  from public.groups
  where upper(join_code) = upper(btrim(p_code)) and is_active = true
  limit 1;

  if g.id is null then
    raise exception 'GROUP_NOT_FOUND';
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (g.id, auth.uid(), 'student')
  on conflict (group_id, user_id) do nothing;

  group_id := g.id;
  exam_id := g.exam_id;
  group_name := g.name;
  return next;
end;
$$;

grant execute on function public.join_group_by_code(text) to authenticated;
