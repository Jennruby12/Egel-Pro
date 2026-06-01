#!/usr/bin/env node
/**
 * Uploader de guias v2: lee scripts/data/guides-v2/*.json y hace UPSERT a
 * guides + guide_sections + guide_concepts.
 *
 * Cada JSON tiene shape:
 *   { guide: {...}, concepts: [...], sections: [...] }
 *
 * Idempotente: si guides.slug ya existe, UPDATE; delete viejos sections+concepts; insert nuevos.
 *
 * Uso:
 *   node scripts/upload-guides-v2.mjs              # dry run
 *   node scripts/upload-guides-v2.mjs --apply      # ejecuta
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DATA_DIR = resolve(ROOT, 'scripts/data/guides-v2')
const APPLY = process.argv.includes('--apply')

const envText = readFileSync(resolve(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(
  envText.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => {
    const eq = l.indexOf('=')
    return [l.slice(0, eq), l.slice(eq + 1)]
  }),
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Faltan envs SUPABASE en .env.local')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
})

console.log(`\nModo: ${APPLY ? 'APPLY (escribe en DB)' : 'DRY RUN'}\n`)
console.log(`Directorio: ${DATA_DIR}\n`)

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))
console.log(`Archivos a procesar: ${files.length}\n`)

const VALID_TYPES = new Set([
  'intro', 'concept', 'example', 'diagram', 'tool', 'case_study',
  'comparison_table', 'glossary', 'quick_quiz', 'references',
])

let totalGuides = 0
let totalSections = 0
let totalConcepts = 0
let errors = 0

for (const file of files) {
  const raw = readFileSync(resolve(DATA_DIR, file), 'utf8')
  let json
  try {
    json = JSON.parse(raw)
  } catch (e) {
    console.error(`SKIP ${file}: JSON invalido: ${e.message}`)
    errors++
    continue
  }
  const { guide, concepts = [], sections = [] } = json
  if (!guide || !guide.slug || !guide.title) {
    console.error(`SKIP ${file}: faltan campos en guide`)
    errors++
    continue
  }
  for (const s of sections) {
    if (!VALID_TYPES.has(s.type)) {
      console.error(`SKIP ${file}: section_type invalido '${s.type}'`)
      errors++
      continue
    }
  }

  console.log(`  ${file.padEnd(45)} → ${concepts.length} conceptos, ${sections.length} secciones`)

  if (!APPLY) {
    totalGuides++
    totalSections += sections.length
    totalConcepts += concepts.length
    continue
  }

  // UPSERT guide por slug
  const guidePayload = {
    section: guide.section,
    area_num: guide.area_num,
    area_name: guide.area_name,
    subarea_num: guide.subarea_num,
    subarea_name: guide.subarea_name,
    slug: guide.slug,
    title: guide.title,
    short_description: guide.short_description ?? null,
    weight_in_exam: guide.weight_in_exam ?? null,
    estimated_minutes: guide.estimated_minutes ?? 30,
    difficulty: guide.difficulty ?? 'intermedio',
    cover_image_url: guide.cover_image_url ?? null,
    order_in_area: guide.order_in_area ?? guide.subarea_num,
    published: guide.published ?? true,
    updated_at: new Date().toISOString(),
  }

  const { data: upserted, error: upsertErr } = await supabase
    .from('guides')
    .upsert(guidePayload, { onConflict: 'slug' })
    .select('id')
    .single()
  if (upsertErr) {
    console.error(`    FAIL upsert guide: ${upsertErr.message}`)
    errors++
    continue
  }
  const guideId = upserted.id

  // Borrar sections y concepts viejos
  await supabase.from('guide_sections').delete().eq('guide_id', guideId)
  await supabase.from('guide_concepts').delete().eq('guide_id', guideId)

  // Insertar concepts
  if (concepts.length > 0) {
    const conceptsPayload = concepts.map((c) => ({
      guide_id: guideId,
      concept: c.concept,
      definition_md: c.definition_md ?? null,
      importance: c.importance ?? 'media',
      related_question_ids: c.related_question_ids ?? null,
    }))
    const { error: cErr } = await supabase.from('guide_concepts').insert(conceptsPayload)
    if (cErr) {
      console.error(`    FAIL concepts: ${cErr.message}`)
      errors++
      continue
    }
  }

  // Insertar sections
  if (sections.length > 0) {
    const sectionsPayload = sections.map((s) => ({
      guide_id: guideId,
      section_type: s.type,
      order_in_guide: s.order,
      title: s.title ?? null,
      body_md: s.body_md ?? null,
      image_url: s.image_url ?? null,
      image_caption: s.image_caption ?? null,
      metadata: s.metadata ?? null,
    }))
    const { error: sErr } = await supabase.from('guide_sections').insert(sectionsPayload)
    if (sErr) {
      console.error(`    FAIL sections: ${sErr.message}`)
      errors++
      continue
    }
  }

  totalGuides++
  totalSections += sections.length
  totalConcepts += concepts.length
}

console.log(`\nTotal: ${totalGuides} guias / ${totalSections} secciones / ${totalConcepts} conceptos`)
if (errors > 0) console.log(`Errores: ${errors}`)
console.log(APPLY ? '\nApply OK' : '\nDry run terminado')
