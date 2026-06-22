-- =====================================================================
-- FASE 1 — Capa de datos multi-examen (ADITIVO / backward-compatible)
-- No rompe produccion: exam_id es NULLABLE con DEFAULT = examen ISOFT,
-- y solo se crean tablas/columnas/politicas NUEVAS. El codigo actual de
-- prod no lee estas columnas; el codigo nuevo (rama preview) si.
-- =====================================================================

-- ID fijo para el examen semilla ISOFT (permite usarlo como DEFAULT).
-- 11111111-1111-4111-8111-111111111111 = EGEL Plus ISOFT

-- 1) Catalogo de examenes -------------------------------------------------
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  code text unique not null,
  name text not null,
  total_questions int not null default 0,
  disciplinar_questions int not null default 0,
  transversal_questions int not null default 0,
  sessions int not null default 1,
  session_seconds int not null default 0,
  pilot_pct numeric not null default 0,
  options_per_question int not null default 3,
  thresholds jsonb not null default '{"ans":{"min":0,"max":59},"satisfactorio":{"min":60,"max":79},"sobresaliente":{"min":80,"max":100}}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.exam_areas (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  section text not null check (section in ('disciplinar','transversal')),
  area_num int not null,
  name text not null,
  total_questions int not null default 0,
  color text,
  color_class text,
  unique (exam_id, section, area_num)
);

create table if not exists public.exam_subareas (
  id uuid primary key default gen_random_uuid(),
  exam_area_id uuid not null references public.exam_areas(id) on delete cascade,
  subarea_num int not null,
  name text not null,
  questions int not null default 0,
  unique (exam_area_id, subarea_num)
);

-- 2) Semilla ISOFT (valores 1:1 de src/lib/constants/egel.ts) -------------
insert into public.exams (
  id, slug, code, name, total_questions, disciplinar_questions,
  transversal_questions, sessions, session_seconds, pilot_pct,
  options_per_question, is_active
) values (
  '11111111-1111-4111-8111-111111111111',
  'egel-isoft', 'EGEL-ISOFT', 'EGEL Plus ISOFT',
  203, 143, 60, 2, 16200, 0.15, 3, true
) on conflict (id) do nothing;

insert into public.exam_areas (exam_id, section, area_num, name, total_questions, color, color_class) values
  ('11111111-1111-4111-8111-111111111111','disciplinar',1,'Analisis de Sistemas de Software',31,'#38bdf8','area1'),
  ('11111111-1111-4111-8111-111111111111','disciplinar',2,'Diseno de Sistemas de Software',33,'#a78bfa','area2'),
  ('11111111-1111-4111-8111-111111111111','disciplinar',3,'Desarrollo de Sistemas de Software',49,'#34d399','area3'),
  ('11111111-1111-4111-8111-111111111111','disciplinar',4,'Gestion de Proyectos de Software',30,'#fbbf24','area4'),
  ('11111111-1111-4111-8111-111111111111','transversal',1,'Comprension Lectora',30,null,null),
  ('11111111-1111-4111-8111-111111111111','transversal',2,'Redaccion Indirecta',30,null,null)
on conflict (exam_id, section, area_num) do nothing;

insert into public.exam_subareas (exam_area_id, subarea_num, name, questions)
select ea.id, v.subarea_num, v.name, v.questions
from (values
  ('disciplinar',1,1,'Tipos de requerimientos',12),
  ('disciplinar',1,2,'Tecnicas y herramientas para obtencion, analisis, priorizacion y validacion de requerimientos',9),
  ('disciplinar',1,3,'Tecnicas y herramientas de documentacion de requerimientos',10),
  ('disciplinar',2,1,'Diseno arquitectonico de software',10),
  ('disciplinar',2,2,'Diseno de modulos, componentes y de datos de software',16),
  ('disciplinar',2,3,'Diseno de interfaces',7),
  ('disciplinar',3,1,'Lenguajes de desarrollo de software',10),
  ('disciplinar',3,2,'Paradigmas de programacion',10),
  ('disciplinar',3,3,'Entornos de desarrollo',10),
  ('disciplinar',3,4,'Gestion de datos',9),
  ('disciplinar',3,5,'Plataformas de desarrollo',10),
  ('disciplinar',4,1,'Gestion de tiempos, costos, recursos humanos y de riesgo',8),
  ('disciplinar',4,2,'Calidad de software',10),
  ('disciplinar',4,3,'Metodologias de desarrollo',12),
  ('transversal',1,1,'Ambito de estudio',12),
  ('transversal',1,2,'Ambito literario',12),
  ('transversal',1,3,'Ambito de participacion social',6),
  ('transversal',2,1,'Ambito de estudio',15),
  ('transversal',2,2,'Ambito de participacion social',15)
) as v(section, area_num, subarea_num, name, questions)
join public.exam_areas ea
  on ea.exam_id = '11111111-1111-4111-8111-111111111111'
  and ea.section = v.section
  and ea.area_num = v.area_num
on conflict (exam_area_id, subarea_num) do nothing;

-- 3) exam_id ADITIVO en tablas de contenido (NULLABLE + DEFAULT ISOFT) -----
-- DEFAULT garantiza que los inserts de prod (que no mandan exam_id) sigan
-- funcionando y queden asignados a ISOFT automaticamente.
do $$
declare
  t text;
  isoft constant text := '11111111-1111-4111-8111-111111111111';
  tbls text[] := array[
    'questions','guides','study_guides','flashcards','stimuli',
    'areas_catalog','user_progress','quiz_sessions'
  ];
begin
  foreach t in array tbls loop
    execute format(
      'alter table public.%I add column if not exists exam_id uuid references public.exams(id) default %L',
      t, isoft
    );
    execute format('update public.%I set exam_id = %L where exam_id is null', t, isoft);
    execute format(
      'create index if not exists %I on public.%I (exam_id)',
      'idx_' || t || '_exam_id', t
    );
  end loop;
end $$;

-- Examen activo por usuario (default ISOFT) --------------------------------
alter table public.profiles
  add column if not exists active_exam_id uuid references public.exams(id)
  default '11111111-1111-4111-8111-111111111111';
update public.profiles set active_exam_id = '11111111-1111-4111-8111-111111111111'
  where active_exam_id is null;

-- 4) RLS solo para las tablas NUEVAS (no se tocan politicas existentes) -----
alter table public.exams enable row level security;
alter table public.exam_areas enable row level security;
alter table public.exam_subareas enable row level security;

-- Lectura publica (autenticados) de la estructura de examenes.
drop policy if exists exams_read on public.exams;
create policy exams_read on public.exams for select using (true);
drop policy if exists exam_areas_read on public.exam_areas;
create policy exam_areas_read on public.exam_areas for select using (true);
drop policy if exists exam_subareas_read on public.exam_subareas;
create policy exam_subareas_read on public.exam_subareas for select using (true);

-- Gestion solo admin (reusa el helper existente public.is_admin()).
drop policy if exists exams_admin on public.exams;
create policy exams_admin on public.exams for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists exam_areas_admin on public.exam_areas;
create policy exam_areas_admin on public.exam_areas for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists exam_subareas_admin on public.exam_subareas;
create policy exam_subareas_admin on public.exam_subareas for all using (public.is_admin()) with check (public.is_admin());
