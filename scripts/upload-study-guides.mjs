#!/usr/bin/env node
/**
 * Sube las 19 guias de estudio (.md) a la tabla study_guides en Supabase.
 * Lee scripts/data/study-guides/{section}-A{area}-s{subarea}.md
 *
 * Uso:
 *   node scripts/upload-study-guides.mjs            # dry run
 *   node scripts/upload-study-guides.mjs --apply    # ejecuta
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const GUIDES_DIR = resolve(ROOT, 'scripts/data/study-guides')
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

console.log(`\nModo: ${APPLY ? 'APPLY' : 'DRY RUN'}\n`)
console.log(`Directorio: ${GUIDES_DIR}`)

const files = readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md'))
console.log(`Archivos encontrados: ${files.length}\n`)

const parsed = []
for (const file of files) {
  const match = file.match(/^(disciplinar|transversal)-A(\d+)-s(\d+)\.md$/)
  if (!match) {
    console.warn(`Skip (nombre no estandar): ${file}`)
    continue
  }
  const [, section, areaStr, subareaStr] = match
  const area = Number(areaStr)
  const subarea = Number(subareaStr)
  const content = readFileSync(resolve(GUIDES_DIR, file), 'utf8')

  // Extraer titulo del primer H1
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : `Guia ${section} A${area}.${subarea}`

  // Estimar tiempo de lectura: ~200 palabras por minuto
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.max(5, Math.round(wordCount / 200))

  // Summary: primer parrafo despues del H1
  const summaryMatch = content.match(/^#[^\n]+\n+([^\n#][^\n]+)/m)
  const summary = summaryMatch ? summaryMatch[1].trim().slice(0, 300) : null

  parsed.push({
    section,
    area,
    subarea,
    title,
    content,
    summary,
    reading_time_minutes: readingTime,
    is_published: true,
    is_deleted: false,
    order_index: subarea, // orden natural por subarea
    file,
    wordCount,
  })
}

// Resumen
console.log('Resumen:')
parsed.forEach((g) => {
  console.log(`  ${g.section.padEnd(12)} A${g.area}.${g.subarea}  ${String(g.wordCount).padStart(5)} pal  ${g.reading_time_minutes}m  "${g.title.slice(0, 50)}"`)
})
console.log(`\nTotal: ${parsed.length} guias`)

if (!APPLY) {
  console.log('\nDry run terminado. Re-ejecuta con --apply para subir.')
  process.exit(0)
}

console.log('\nUPSERT en Supabase...')
let ok = 0
for (const g of parsed) {
  // Buscar guia existente para misma section+area+subarea
  const { data: existing } = await supabase
    .from('study_guides')
    .select('id')
    .eq('section', g.section)
    .eq('area', g.area)
    .eq('subarea', g.subarea)
    .eq('is_deleted', false)
    .maybeSingle()

  const payload = {
    section: g.section,
    area: g.area,
    subarea: g.subarea,
    title: g.title,
    content: g.content,
    summary: g.summary,
    reading_time_minutes: g.reading_time_minutes,
    is_published: g.is_published,
    is_deleted: g.is_deleted,
    order_index: g.order_index,
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    const { error } = await supabase.from('study_guides').update(payload).eq('id', existing.id)
    if (error) {
      console.error(`  FAIL update ${g.file}: ${error.message}`)
      continue
    }
    console.log(`  UPDATED ${g.file}`)
  } else {
    const { error } = await supabase.from('study_guides').insert(payload)
    if (error) {
      console.error(`  FAIL insert ${g.file}: ${error.message}`)
      continue
    }
    console.log(`  INSERTED ${g.file}`)
  }
  ok++
}

console.log(`\nOK: ${ok} de ${parsed.length}\n`)
