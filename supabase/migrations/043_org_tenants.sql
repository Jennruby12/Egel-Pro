-- =====================================================================
-- FASE 5 — Tenants / organizaciones (ADITIVO). Activa la tabla organizations
-- (ya existente) + org_role (owner/manager) para B2B. Solo helpers y políticas
-- SELECT nuevas; no se tocan las existentes. prod (main) no lo usa → intacto.
-- =====================================================================

-- Helpers SECURITY DEFINER (evitan recursión RLS al consultar profiles).
create or replace function public.my_org_id()
returns uuid language sql security definer set search_path = public stable as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_org_manager()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and organization_id is not null
      and org_role in ('owner','manager')
  );
$$;

-- ¿auth.uid() es manager/owner de la MISMA organización que el usuario uid?
create or replace function public.can_manage_org_user(uid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1
    from public.profiles mgr
    join public.profiles usr on usr.organization_id = mgr.organization_id
    where mgr.id = auth.uid()
      and mgr.org_role in ('owner','manager')
      and mgr.organization_id is not null
      and usr.id = uid
  );
$$;

-- profiles: un manager/owner lee los perfiles de su organización.
drop policy if exists org_managers_read_members on public.profiles;
create policy org_managers_read_members on public.profiles for select
  using (is_org_manager() and organization_id = public.my_org_id());

-- groups: un manager/owner ve los grupos de su organización (además del dueño).
drop policy if exists org_managers_read_org_groups on public.groups;
create policy org_managers_read_org_groups on public.groups for select
  using (is_org_manager() and organization_id = public.my_org_id());

-- quiz_sessions: un manager/owner ve las sesiones de los usuarios de su org.
drop policy if exists org_managers_read_org_sessions on public.quiz_sessions;
create policy org_managers_read_org_sessions on public.quiz_sessions for select
  using (public.can_manage_org_user(user_id));

-- user_progress: ya existe org_managers_read_member_progress (017). No se toca.
