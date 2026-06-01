-- Modulo Estudiar v2: 19 guias estructuradas con secciones tipificadas.
-- Reemplaza study_guides (legacy) como fuente primaria de /study/v2.
--
-- 4 tablas nuevas:
--   guides              -> metadata por guia (1 por subarea = 19)
--   guide_sections      -> 10 tipos de seccion por guia (intro, concept, example,
--                          diagram, tool, case_study, comparison_table, glossary,
--                          quick_quiz, references)
--   guide_concepts      -> conceptos clave con importancia y reactivos relacionados
--   user_guide_progress -> tracking de lectura por usuario
--
-- RLS: lectura publica si published=true. Progreso es del propio user.
-- Bucket study-diagrams publico para los 45 diagramas referenciados.

CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_num int NOT NULL,
  section text NOT NULL CHECK (section IN ('disciplinar','transversal')),
  area_name text NOT NULL,
  subarea_num int NOT NULL,
  subarea_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  short_description text,
  weight_in_exam int,
  estimated_minutes int DEFAULT 30,
  difficulty text DEFAULT 'intermedio',
  cover_image_url text,
  order_in_area int,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guides_section_area ON public.guides(section, area_num, subarea_num);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON public.guides(slug);

CREATE TABLE IF NOT EXISTS public.guide_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  section_type text NOT NULL CHECK (section_type IN (
    'intro','concept','example','diagram','tool','case_study',
    'comparison_table','glossary','quick_quiz','references'
  )),
  order_in_guide int NOT NULL,
  title text,
  body_md text,
  image_url text,
  image_caption text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_guide_sections_guide ON public.guide_sections(guide_id, order_in_guide);

CREATE TABLE IF NOT EXISTS public.guide_concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  concept text NOT NULL,
  definition_md text,
  importance text CHECK (importance IN ('alta','media','baja')),
  related_question_ids uuid[]
);
CREATE INDEX IF NOT EXISTS idx_guide_concepts_guide ON public.guide_concepts(guide_id);

CREATE TABLE IF NOT EXISTS public.user_guide_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  status text DEFAULT 'no_iniciado' CHECK (status IN ('no_iniciado','en_progreso','completado')),
  percent_read int DEFAULT 0,
  last_section_id uuid,
  started_at timestamptz,
  completed_at timestamptz,
  time_spent_seconds int DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, guide_id)
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_published_guides" ON public.guides FOR SELECT USING (published = true);

ALTER TABLE public.guide_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_sections" ON public.guide_sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.guides WHERE public.guides.id = guide_sections.guide_id AND public.guides.published = true)
);

ALTER TABLE public.guide_concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_concepts" ON public.guide_concepts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.guides WHERE public.guides.id = guide_concepts.guide_id AND public.guides.published = true)
);

ALTER TABLE public.user_guide_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_progress_select" ON public.user_guide_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_progress_insert" ON public.user_guide_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_progress_update" ON public.user_guide_progress FOR UPDATE USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('study-diagrams', 'study-diagrams', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read study-diagrams" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'study-diagrams');
