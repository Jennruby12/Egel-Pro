-- Seed data oficial del examen EGEL Plus ISOFT (CENEVAL oct 2025)
-- Total: 203 reactivos (143 disciplinar + 60 transversal)
-- Idempotente: usa ON CONFLICT para reaplicar sin error

INSERT INTO areas_catalog (area, area_name, subarea, subarea_name, section, expected_questions) VALUES
  -- Area 1 Disciplinar: Analisis de Sistemas de Software (31 reactivos)
  (1, 'Analisis de Sistemas de Software', 1, 'Tipos de requerimientos', 'disciplinar', 12),
  (1, 'Analisis de Sistemas de Software', 2, 'Tecnicas y herramientas para obtencion, analisis, priorizacion y validacion', 'disciplinar', 9),
  (1, 'Analisis de Sistemas de Software', 3, 'Tecnicas y herramientas de documentacion de requerimientos', 'disciplinar', 10),
  -- Area 2 Disciplinar: Diseno de Sistemas de Software (33 reactivos)
  (2, 'Diseno de Sistemas de Software', 1, 'Diseno arquitectonico de software', 'disciplinar', 10),
  (2, 'Diseno de Sistemas de Software', 2, 'Diseno de modulos, componentes y de datos', 'disciplinar', 16),
  (2, 'Diseno de Sistemas de Software', 3, 'Diseno de interfaces', 'disciplinar', 7),
  -- Area 3 Disciplinar: Desarrollo de Sistemas de Software (49 reactivos)
  (3, 'Desarrollo de Sistemas de Software', 1, 'Lenguajes de desarrollo de software', 'disciplinar', 10),
  (3, 'Desarrollo de Sistemas de Software', 2, 'Paradigmas de programacion', 'disciplinar', 10),
  (3, 'Desarrollo de Sistemas de Software', 3, 'Entornos de desarrollo', 'disciplinar', 10),
  (3, 'Desarrollo de Sistemas de Software', 4, 'Gestion de datos', 'disciplinar', 9),
  (3, 'Desarrollo de Sistemas de Software', 5, 'Plataformas de desarrollo', 'disciplinar', 10),
  -- Area 4 Disciplinar: Gestion de Proyectos de Software (30 reactivos)
  (4, 'Gestion de Proyectos de Software', 1, 'Gestion de tiempos, costos, recursos humanos y de riesgo', 'disciplinar', 8),
  (4, 'Gestion de Proyectos de Software', 2, 'Calidad de software', 'disciplinar', 10),
  (4, 'Gestion de Proyectos de Software', 3, 'Metodologias de desarrollo', 'disciplinar', 12),
  -- Area 1 Transversal: Comprension Lectora (30 reactivos)
  (1, 'Comprension Lectora', 1, 'Ambito de estudio', 'transversal', 12),
  (1, 'Comprension Lectora', 2, 'Ambito literario', 'transversal', 12),
  (1, 'Comprension Lectora', 3, 'Ambito de participacion social', 'transversal', 6),
  -- Area 2 Transversal: Redaccion Indirecta (30 reactivos)
  (2, 'Redaccion Indirecta', 1, 'Ambito de estudio', 'transversal', 15),
  (2, 'Redaccion Indirecta', 2, 'Ambito de participacion social', 'transversal', 15)
ON CONFLICT (area, subarea, section) DO UPDATE SET
  area_name = EXCLUDED.area_name,
  subarea_name = EXCLUDED.subarea_name,
  expected_questions = EXCLUDED.expected_questions;
