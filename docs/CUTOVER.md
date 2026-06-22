# Cutover a producción — Multi-examen + Roles + Grupos + Tenants

Rama: `claude/project-github-vercel-setup-nnov8c` → `main`.

## Contexto
Todas las migraciones (040–044) ya están aplicadas sobre la **BD compartida**
(que también usa producción) de forma **aditiva y backward-compatible**, por lo
que `main` actual sigue funcionando idéntico. El cutover consiste en llevar el
**código** de la rama a `main`.

## Pre-requisitos (antes del merge)
1. **Env vars en Vercel** para Preview y Production (ya deben estar en Production):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (+ email/RESEND si aplica).
2. Validar el **preview** con env vars: registro → onboarding (libre / código /
   maestro), `/teacher`, `/admin/exams`, `/admin/orgs`, `/org`.
3. `npm run typecheck && npm run lint && npm run test && npm run build` en verde.

## Migraciones aplicadas (verificar en orden en la BD)
- `040_exams` — exams/exam_areas/exam_subareas + `exam_id` (default ISOFT) + `active_exam_id`.
- `041_groups` — role `teacher`, groups/group_members, RLS, `join_group_by_code`.
- `042_teacher_read_member_profiles` — maestro lee perfil de sus alumnos.
- `043_org_tenants` — helpers org + RLS de organización.
- `044_user_progress_exam_unique` — índice único `(user_id, exam_id, area, subarea)`.

## Merge
1. `git checkout main && git pull`
2. `git merge claude/project-github-vercel-setup-nnov8c`
3. `git push origin main` → Vercel despliega producción.
4. Verificar deploy READY y que un usuario existente (ISOFT) ve todo igual
   (mismos conteos, simulacro 203, niveles).

## Regla IMPORTANTE para el 2º examen (post-cutover)
La única **antigua** de `user_progress` `(user_id, area, subarea)` todavía existe
(coexiste sin problema mientras solo haya ISOFT). **Antes** de sembrar/activar un
2º examen con preguntas, crear `045_drop_old_user_progress_unique.sql`:

```sql
alter table public.user_progress
  drop constraint if exists user_progress_user_id_area_subarea_key;
```

(Confirmar el nombre real del constraint con:
`select conname from pg_constraint where conrelid='public.user_progress'::regclass and contype='u';`)

Sin ese drop, el alumno no podría tener la misma (area, subarea) en dos exámenes.

## Rollback
- Código: revertir el merge en `main` (las tablas/columnas aditivas pueden quedar;
  no estorban a la versión anterior).
