#!/usr/bin/env node
/**
 * Genera 45 SVG placeholders profesionales en public/diagrams/ y emite el SQL
 * seed correspondiente en supabase/migrations/030_diagrams_seed.sql.
 *
 * Estrategia: en lugar de subir a Supabase Storage (requiere credenciales runtime)
 * los SVG viajan en el repo y se sirven por el CDN de Vercel. La migration luego
 * inserta secciones tipo 'diagram' en las guias publicadas, shifteando los
 * order_in_guide para colocarlas despues del case_study (order 4).
 *
 * Uso:
 *   node scripts/generate-diagrams.mjs           # solo genera SVG + SQL (idempotente)
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SVG_DIR = resolve(ROOT, 'public/diagrams')
const SQL_OUT = resolve(ROOT, 'supabase/migrations/030_diagrams_seed.sql')

const DIAGRAMS = [
  { file: 'uml-include-extend', cat: 'UML', title: 'Casos de uso: include y extend', guide: 'tipos-de-requerimientos' },
  { file: 'uml-secuencia-sincrono', cat: 'UML', title: 'Diagrama de secuencia (sincrono)', guide: 'tecnicas-obtencion-validacion' },
  { file: 'uml-clases-asociacion', cat: 'UML', title: 'Diagrama de clases con asociacion', guide: 'documentacion-de-requerimientos' },
  { file: 'uml-actividad-decision', cat: 'UML', title: 'Diagrama de actividad con decision', guide: 'documentacion-de-requerimientos' },
  { file: 'uml-estados-transicion', cat: 'UML', title: 'Diagrama de estados y transiciones', guide: 'documentacion-de-requerimientos' },

  { file: 'arquitectura-microservicios', cat: 'Arquitectura', title: 'Arquitectura de microservicios', guide: 'diseno-arquitectonico' },
  { file: 'arquitectura-capas', cat: 'Arquitectura', title: 'Arquitectura en capas N-tier', guide: 'diseno-arquitectonico' },
  { file: 'mvc-flujo', cat: 'Arquitectura', title: 'Flujo MVC', guide: 'diseno-arquitectonico' },

  { file: 'er-relacion-nm', cat: 'Datos', title: 'ER: relacion N:M con tabla puente', guide: 'modulos-componentes-datos' },
  { file: '1fn-ejemplo', cat: 'Datos', title: 'Primera Forma Normal (1FN)', guide: 'modulos-componentes-datos' },
  { file: 'normalizacion-3fn', cat: 'Datos', title: 'Normalizacion 1FN a 3FN', guide: 'modulos-componentes-datos' },
  { file: 'fragmentacion-horizontal', cat: 'Datos', title: 'Fragmentacion horizontal', guide: 'modulos-componentes-datos' },
  { file: 'observer-pattern', cat: 'Patrones', title: 'Patron Observer', guide: 'modulos-componentes-datos' },
  { file: 'acoplamiento-niveles', cat: 'Diseno', title: 'Niveles de acoplamiento', guide: 'modulos-componentes-datos' },

  { file: 'btree-index', cat: 'Datos', title: 'Indice B-tree', guide: 'gestion-de-datos' },
  { file: 'niveles-aislamiento', cat: 'Datos', title: 'Niveles de aislamiento SQL', guide: 'gestion-de-datos' },
  { file: 'sql-joins', cat: 'Datos', title: 'Tipos de JOIN', guide: 'gestion-de-datos' },
  { file: 'olap-vs-oltp', cat: 'Datos', title: 'OLTP vs OLAP', guide: 'gestion-de-datos' },
  { file: 'cap-theorem', cat: 'Datos', title: 'Teorema CAP', guide: 'gestion-de-datos' },

  { file: 'pert-formula', cat: 'Gestion', title: 'PERT: Te = (O + 4M + P) / 6', guide: 'tiempos-costos-rh-riesgo' },

  { file: 'cmmi-niveles', cat: 'Gestion', title: 'CMMI: 5 niveles de madurez', guide: 'calidad-de-software' },

  { file: 'scrum-roles', cat: 'Gestion', title: 'Scrum: 3 roles (PO, SM, Dev)', guide: 'metodologias-de-desarrollo' },
  { file: 'scrum-sprint', cat: 'Gestion', title: 'Scrum: flujo del Sprint', guide: 'metodologias-de-desarrollo' },
  { file: 'kanban-wip', cat: 'Gestion', title: 'Kanban: limites WIP', guide: 'metodologias-de-desarrollo' },
  { file: 'waterfall', cat: 'Gestion', title: 'Modelo Cascada (Waterfall)', guide: 'metodologias-de-desarrollo' },
  { file: 'modelo-espiral', cat: 'Gestion', title: 'Modelo Espiral (Boehm)', guide: 'metodologias-de-desarrollo' },
  { file: 'rup-fases', cat: 'Gestion', title: 'RUP: 4 fases', guide: 'metodologias-de-desarrollo' },
  { file: 'v-model', cat: 'Gestion', title: 'Modelo V', guide: 'metodologias-de-desarrollo' },
  { file: 'scrum-vs-kanban', cat: 'Gestion', title: 'Scrum vs Kanban', guide: 'metodologias-de-desarrollo' },

  { file: 'iaas-paas-saas', cat: 'Plataformas', title: 'IaaS / PaaS / SaaS / FaaS', guide: 'plataformas-desarrollo' },
  { file: 'k8s-pod', cat: 'Plataformas', title: 'Kubernetes: Pod, Deployment, Service', guide: 'plataformas-desarrollo' },
  { file: 'cdn-funcionamiento', cat: 'Plataformas', title: 'CDN: funcionamiento', guide: 'plataformas-desarrollo' },
  { file: 'docker-image-container', cat: 'Plataformas', title: 'Docker: imagen vs contenedor', guide: 'plataformas-desarrollo' },
  { file: 'docker-vs-vm', cat: 'Plataformas', title: 'Docker vs VM', guide: 'plataformas-desarrollo' },
  { file: 'auto-scaling', cat: 'Plataformas', title: 'Auto-scaling cloud', guide: 'plataformas-desarrollo' },
  { file: 'load-balancer-l4-l7', cat: 'Plataformas', title: 'Load Balancer L4 vs L7', guide: 'plataformas-desarrollo' },
  { file: 'api-gateway', cat: 'Plataformas', title: 'API Gateway', guide: 'plataformas-desarrollo' },

  { file: 'cicd-pipeline', cat: 'DevOps', title: 'CI/CD pipeline', guide: 'entornos-desarrollo' },
  { file: 'git-branches', cat: 'DevOps', title: 'Git branches', guide: 'entornos-desarrollo' },
  { file: 'git-rebase-vs-merge', cat: 'DevOps', title: 'Git rebase vs merge', guide: 'entornos-desarrollo' },
  { file: 'gitflow-diagram', cat: 'DevOps', title: 'GitFlow', guide: 'entornos-desarrollo' },

  { file: 'flexbox-axes', cat: 'Frontend', title: 'Flexbox: ejes principal y cruzado', guide: 'lenguajes-desarrollo' },

  { file: 'promesa-estados', cat: 'JS', title: 'Promise: estados', guide: 'paradigmas-programacion' },
  { file: 'event-loop', cat: 'JS', title: 'Event loop de Node.js', guide: 'paradigmas-programacion' },
  { file: 'queue-vs-stack', cat: 'Algoritmos', title: 'Queue vs Stack', guide: 'paradigmas-programacion' },
]

function svgFor({ cat, title }) {
  const safe = (s) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1e"/>
      <stop offset="50%" stop-color="#1a1340"/>
      <stop offset="100%" stop-color="#0a0f1e"/>
    </linearGradient>
    <radialGradient id="aurora1" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="aurora2" cx="80%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="aurora3" cx="50%" cy="50%" r="40%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#34d399" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#bg)"/>
  <rect width="1200" height="600" fill="url(#aurora1)"/>
  <rect width="1200" height="600" fill="url(#aurora2)"/>
  <rect width="1200" height="600" fill="url(#aurora3)"/>
  <rect x="40" y="40" width="1120" height="520" rx="24" fill="none" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="2"/>
  <text x="600" y="170" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="600" fill="#38bdf8" letter-spacing="4">${safe(cat).toUpperCase()}</text>
  <text x="600" y="290" text-anchor="middle" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#ffffff">${safe(title)}</text>
  <text x="600" y="360" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" fill="#a78bfa" opacity="0.8">Diagrama de referencia</text>
  <text x="600" y="500" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#9ca3af" opacity="0.6">EGEL Pro - Material de estudio</text>
</svg>`
}

const byGuide = new Map()
for (const d of DIAGRAMS) {
  if (!byGuide.has(d.guide)) byGuide.set(d.guide, [])
  byGuide.get(d.guide).push(d)
}

mkdirSync(SVG_DIR, { recursive: true })
let written = 0
for (const d of DIAGRAMS) {
  writeFileSync(resolve(SVG_DIR, `${d.file}.svg`), svgFor(d))
  written++
}
console.log(`SVG generados: ${written}/45 en public/diagrams/`)

const sqlEscape = (s) => s.replace(/'/g, "''")
const blocks = []
for (const [slug, arr] of byGuide) {
  const N = arr.length
  const inserts = arr
    .map((d, i) => `  (guide_uuid, 'diagram', ${5 + i}, '${sqlEscape(d.title)}', '/diagrams/${d.file}.svg', '${sqlEscape(d.title)}', jsonb_build_object('category','${sqlEscape(d.cat)}'))`)
    .join(',\n')

  blocks.push(`-- ${slug} (+${N} diagramas)
DO $$
DECLARE
  guide_uuid uuid;
BEGIN
  SELECT id INTO guide_uuid FROM guides WHERE slug = '${sqlEscape(slug)}';
  IF guide_uuid IS NULL THEN
    RAISE NOTICE 'guia ${sqlEscape(slug)} no encontrada, skip';
    RETURN;
  END IF;

  DELETE FROM guide_sections
   WHERE guide_id = guide_uuid AND section_type = 'diagram';

  UPDATE guide_sections
     SET order_in_guide = order_in_guide + ${N}
   WHERE guide_id = guide_uuid AND order_in_guide >= 5;

  INSERT INTO guide_sections (guide_id, section_type, order_in_guide, title, image_url, image_caption, metadata)
  VALUES
${inserts};
END $$;`)
}

const sql = `-- 030_diagrams_seed.sql
-- Inserta 45 secciones type='diagram' en 11 guias publicadas.
-- Idempotente: borra diagrams previas y reshiftea orders.
-- Imagenes servidas desde public/diagrams/*.svg (no requiere Storage).

${blocks.join('\n\n')}
`

writeFileSync(SQL_OUT, sql)
console.log(`SQL seed escrito: ${SQL_OUT}`)
console.log(`Total: ${DIAGRAMS.length} diagramas, ${byGuide.size} guias afectadas`)
console.log(`\nAplica con: npm run db:push (o copia-pega en SQL Editor de Supabase)`)
