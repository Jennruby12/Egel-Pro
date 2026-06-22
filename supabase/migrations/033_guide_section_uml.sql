-- Permitir el nuevo section_type 'uml' (diagramas Mermaid editables/exportables)
-- en las guias de estudio.

ALTER TABLE public.guide_sections DROP CONSTRAINT IF EXISTS guide_sections_section_type_check;

ALTER TABLE public.guide_sections ADD CONSTRAINT guide_sections_section_type_check
  CHECK (section_type = ANY (ARRAY[
    'intro','concept','example','diagram','uml','tool','case_study',
    'comparison_table','glossary','quick_quiz','references'
  ]::text[]));
