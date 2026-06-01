-- 030_diagrams_seed.sql
-- Inserta 45 secciones type='diagram' en 11 guias publicadas.
-- Idempotente: borra diagrams previas y reshiftea orders.
-- Imagenes servidas desde public/diagrams/*.svg (no requiere Storage).

-- tipos-de-requerimientos (+1 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'tipos-de-requerimientos';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia tipos-de-requerimientos no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 1
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Casos de uso: include y extend', '/diagrams/uml-include-extend.svg', 'Casos de uso: include y extend', jsonb_build_object('category','UML'));
END $$;

-- tecnicas-obtencion-validacion (+1 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'tecnicas-obtencion-validacion';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia tecnicas-obtencion-validacion no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 1
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Diagrama de secuencia (sincrono)', '/diagrams/uml-secuencia-sincrono.svg', 'Diagrama de secuencia (sincrono)', jsonb_build_object('category','UML'));
END $$;

-- documentacion-de-requerimientos (+3 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'documentacion-de-requerimientos';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia documentacion-de-requerimientos no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 3
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Diagrama de clases con asociacion', '/diagrams/uml-clases-asociacion.svg', 'Diagrama de clases con asociacion', jsonb_build_object('category','UML')),
  (guide_uuid, 'diagram', 6, 'Diagrama de actividad con decision', '/diagrams/uml-actividad-decision.svg', 'Diagrama de actividad con decision', jsonb_build_object('category','UML')),
  (guide_uuid, 'diagram', 7, 'Diagrama de estados y transiciones', '/diagrams/uml-estados-transicion.svg', 'Diagrama de estados y transiciones', jsonb_build_object('category','UML'));
END $$;

-- diseno-arquitectonico (+3 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'diseno-arquitectonico';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia diseno-arquitectonico no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 3
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Arquitectura de microservicios', '/diagrams/arquitectura-microservicios.svg', 'Arquitectura de microservicios', jsonb_build_object('category','Arquitectura')),
  (guide_uuid, 'diagram', 6, 'Arquitectura en capas N-tier', '/diagrams/arquitectura-capas.svg', 'Arquitectura en capas N-tier', jsonb_build_object('category','Arquitectura')),
  (guide_uuid, 'diagram', 7, 'Flujo MVC', '/diagrams/mvc-flujo.svg', 'Flujo MVC', jsonb_build_object('category','Arquitectura'));
END $$;

-- modulos-componentes-datos (+6 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'modulos-componentes-datos';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia modulos-componentes-datos no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 6
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'ER: relacion N:M con tabla puente', '/diagrams/er-relacion-nm.svg', 'ER: relacion N:M con tabla puente', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 6, 'Primera Forma Normal (1FN)', '/diagrams/1fn-ejemplo.svg', 'Primera Forma Normal (1FN)', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 7, 'Normalizacion 1FN a 3FN', '/diagrams/normalizacion-3fn.svg', 'Normalizacion 1FN a 3FN', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 8, 'Fragmentacion horizontal', '/diagrams/fragmentacion-horizontal.svg', 'Fragmentacion horizontal', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 9, 'Patron Observer', '/diagrams/observer-pattern.svg', 'Patron Observer', jsonb_build_object('category','Patrones')),
  (guide_uuid, 'diagram', 10, 'Niveles de acoplamiento', '/diagrams/acoplamiento-niveles.svg', 'Niveles de acoplamiento', jsonb_build_object('category','Diseno'));
END $$;

-- gestion-de-datos (+5 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'gestion-de-datos';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia gestion-de-datos no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 5
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Indice B-tree', '/diagrams/btree-index.svg', 'Indice B-tree', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 6, 'Niveles de aislamiento SQL', '/diagrams/niveles-aislamiento.svg', 'Niveles de aislamiento SQL', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 7, 'Tipos de JOIN', '/diagrams/sql-joins.svg', 'Tipos de JOIN', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 8, 'OLTP vs OLAP', '/diagrams/olap-vs-oltp.svg', 'OLTP vs OLAP', jsonb_build_object('category','Datos')),
  (guide_uuid, 'diagram', 9, 'Teorema CAP', '/diagrams/cap-theorem.svg', 'Teorema CAP', jsonb_build_object('category','Datos'));
END $$;

-- tiempos-costos-rh-riesgo (+1 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'tiempos-costos-rh-riesgo';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia tiempos-costos-rh-riesgo no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 1
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'PERT: Te = (O + 4M + P) / 6', '/diagrams/pert-formula.svg', 'PERT: Te = (O + 4M + P) / 6', jsonb_build_object('category','Gestion'));
END $$;

-- calidad-de-software (+1 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'calidad-de-software';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia calidad-de-software no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 1
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'CMMI: 5 niveles de madurez', '/diagrams/cmmi-niveles.svg', 'CMMI: 5 niveles de madurez', jsonb_build_object('category','Gestion'));
END $$;

-- metodologias-de-desarrollo (+8 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'metodologias-de-desarrollo';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia metodologias-de-desarrollo no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 8
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Scrum: 3 roles (PO, SM, Dev)', '/diagrams/scrum-roles.svg', 'Scrum: 3 roles (PO, SM, Dev)', jsonb_build_object('category','Gestion')),
  (guide_uuid, 'diagram', 6, 'Scrum: flujo del Sprint', '/diagrams/scrum-sprint.svg', 'Scrum: flujo del Sprint', jsonb_build_object('category','Gestion')),
  (guide_uuid, 'diagram', 7, 'Kanban: limites WIP', '/diagrams/kanban-wip.svg', 'Kanban: limites WIP', jsonb_build_object('category','Gestion')),
  (guide_uuid, 'diagram', 8, 'Modelo Cascada (Waterfall)', '/diagrams/waterfall.svg', 'Modelo Cascada (Waterfall)', jsonb_build_object('category','Gestion')),
  (guide_uuid, 'diagram', 9, 'Modelo Espiral (Boehm)', '/diagrams/modelo-espiral.svg', 'Modelo Espiral (Boehm)', jsonb_build_object('category','Gestion')),
  (guide_uuid, 'diagram', 10, 'RUP: 4 fases', '/diagrams/rup-fases.svg', 'RUP: 4 fases', jsonb_build_object('category','Gestion')),
  (guide_uuid, 'diagram', 11, 'Modelo V', '/diagrams/v-model.svg', 'Modelo V', jsonb_build_object('category','Gestion')),
  (guide_uuid, 'diagram', 12, 'Scrum vs Kanban', '/diagrams/scrum-vs-kanban.svg', 'Scrum vs Kanban', jsonb_build_object('category','Gestion'));
END $$;

-- plataformas-desarrollo (+8 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'plataformas-desarrollo';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia plataformas-desarrollo no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 8
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'IaaS / PaaS / SaaS / FaaS', '/diagrams/iaas-paas-saas.svg', 'IaaS / PaaS / SaaS / FaaS', jsonb_build_object('category','Plataformas')),
  (guide_uuid, 'diagram', 6, 'Kubernetes: Pod, Deployment, Service', '/diagrams/k8s-pod.svg', 'Kubernetes: Pod, Deployment, Service', jsonb_build_object('category','Plataformas')),
  (guide_uuid, 'diagram', 7, 'CDN: funcionamiento', '/diagrams/cdn-funcionamiento.svg', 'CDN: funcionamiento', jsonb_build_object('category','Plataformas')),
  (guide_uuid, 'diagram', 8, 'Docker: imagen vs contenedor', '/diagrams/docker-image-container.svg', 'Docker: imagen vs contenedor', jsonb_build_object('category','Plataformas')),
  (guide_uuid, 'diagram', 9, 'Docker vs VM', '/diagrams/docker-vs-vm.svg', 'Docker vs VM', jsonb_build_object('category','Plataformas')),
  (guide_uuid, 'diagram', 10, 'Auto-scaling cloud', '/diagrams/auto-scaling.svg', 'Auto-scaling cloud', jsonb_build_object('category','Plataformas')),
  (guide_uuid, 'diagram', 11, 'Load Balancer L4 vs L7', '/diagrams/load-balancer-l4-l7.svg', 'Load Balancer L4 vs L7', jsonb_build_object('category','Plataformas')),
  (guide_uuid, 'diagram', 12, 'API Gateway', '/diagrams/api-gateway.svg', 'API Gateway', jsonb_build_object('category','Plataformas'));
END $$;

-- entornos-desarrollo (+4 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'entornos-desarrollo';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia entornos-desarrollo no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 4
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'CI/CD pipeline', '/diagrams/cicd-pipeline.svg', 'CI/CD pipeline', jsonb_build_object('category','DevOps')),
  (guide_uuid, 'diagram', 6, 'Git branches', '/diagrams/git-branches.svg', 'Git branches', jsonb_build_object('category','DevOps')),
  (guide_uuid, 'diagram', 7, 'Git rebase vs merge', '/diagrams/git-rebase-vs-merge.svg', 'Git rebase vs merge', jsonb_build_object('category','DevOps')),
  (guide_uuid, 'diagram', 8, 'GitFlow', '/diagrams/gitflow-diagram.svg', 'GitFlow', jsonb_build_object('category','DevOps'));
END $$;

-- lenguajes-desarrollo (+1 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'lenguajes-desarrollo';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia lenguajes-desarrollo no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 1
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Flexbox: ejes principal y cruzado', '/diagrams/flexbox-axes.svg', 'Flexbox: ejes principal y cruzado', jsonb_build_object('category','Frontend'));
END $$;

-- paradigmas-programacion (+3 diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = 'paradigmas-programacion';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia paradigmas-programacion no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + 3
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
  (guide_uuid, 'diagram', 5, 'Promise: estados', '/diagrams/promesa-estados.svg', 'Promise: estados', jsonb_build_object('category','JS')),
  (guide_uuid, 'diagram', 6, 'Event loop de Node.js', '/diagrams/event-loop.svg', 'Event loop de Node.js', jsonb_build_object('category','JS')),
  (guide_uuid, 'diagram', 7, 'Queue vs Stack', '/diagrams/queue-vs-stack.svg', 'Queue vs Stack', jsonb_build_object('category','Algoritmos'));
END $$;
