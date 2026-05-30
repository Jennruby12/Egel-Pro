#!/usr/bin/env node
/**
 * Importa el CSV LIMPIO al banco de preguntas:
 *   .claude/docs/egelpro-banco-preguntas-2026-05-30-LIMPIO.xlsx - Preguntas_Limpio.csv
 *
 * Pasos:
 *   1. Lee CSV (1238 preguntas)
 *   2. Inserta estimulos placeholder faltantes
 *   3. UPSERT preguntas por ID (insert si nueva, update si ya existe)
 *   4. Soft-delete preguntas viejas no presentes en CSV
 *
 * Uso:
 *   node scripts/import-csv-bank.mjs            # dry run
 *   node scripts/import-csv-bank.mjs --apply    # ejecuta
 */

import XLSX from 'xlsx'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CSV_PATH = resolve(
  ROOT,
  '.claude/docs/egelpro-banco-preguntas-2026-05-30-LIMPIO.xlsx - Preguntas_Limpio.csv',
)
const APPLY = process.argv.includes('--apply')

// Env
const envText = readFileSync(resolve(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(
  envText.split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
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

// ============================================================
// 1) Leer CSV y normalizar
// ============================================================
console.log(`\nModo: ${APPLY ? 'APPLY (escribe en DB)' : 'DRY RUN (no escribe)'}\n`)
console.log(`Leyendo: ${CSV_PATH}`)
const csvText = readFileSync(CSV_PATH, 'utf8')
const wb = XLSX.read(csvText, { type: 'string' })
const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
console.log(`Filas leidas: ${rawRows.length}`)

const VALID_TYPES = new Set(['single', 'multireactivo'])
const VALID_DIFF = new Set(['easy', 'medium', 'hard'])
const VALID_ANS = new Set(['a', 'b', 'c'])
const VALID_SECTION = new Set(['disciplinar', 'transversal'])

function normalizeRow(r) {
  const errors = []
  const section = String(r.Seccion || '').trim().toLowerCase()
  const area = Number(r.Area)
  const subarea = Number(r.Subarea)
  let type = String(r.Tipo || 'single').trim().toLowerCase()
  if (type === 'multi') type = 'multireactivo'
  const correct = String(r['Respuesta correcta'] || '').trim().toLowerCase()
  const difficulty = String(r.Dificultad || 'medium').trim().toLowerCase()
  const piloto = String(r.Piloto || 'no').trim().toLowerCase() === 'si'
  const imagenName = String(r['Imagen URL'] || '').trim()
  const tagsRaw = String(r.Tags || '').trim()
  const tagsArr = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
  // Si hay imagen, preservamos el nombre en tags como 'img:nombre.png' para
  // poder repoblar image_url despues cuando se suban a Supabase Storage.
  if (imagenName) tagsArr.unshift(`img:${imagenName}`)
  const stimulusId = String(r['Stimulus ID'] || '').trim() || null

  // Validaciones
  if (!VALID_SECTION.has(section)) errors.push(`section invalido: ${r.Seccion}`)
  if (!Number.isInteger(area) || area < 1 || area > 4) errors.push(`area invalida: ${r.Area}`)
  if (!Number.isInteger(subarea) || subarea < 1 || subarea > 5) errors.push(`subarea invalida: ${r.Subarea}`)
  if (!VALID_TYPES.has(type)) errors.push(`type invalido: ${type}`)
  if (!VALID_ANS.has(correct)) errors.push(`correct_answer invalido: ${correct}`)
  if (!VALID_DIFF.has(difficulty)) errors.push(`difficulty invalido: ${difficulty}`)
  if (!r.ID || !/^[0-9a-f-]{36}$/i.test(String(r.ID))) errors.push(`ID UUID invalido: ${r.ID}`)
  if (!r.Pregunta || String(r.Pregunta).length < 10) errors.push(`Pregunta muy corta`)
  if (!r['Opcion A'] || !r['Opcion B'] || !r['Opcion C']) errors.push(`Falta alguna opcion`)
  if (!r['Nombre Area'] || !r['Nombre Subarea']) errors.push(`Falta nombre area/subarea`)

  if (errors.length) return { errors, raw: r }

  return {
    ok: {
      id: String(r.ID),
      section,
      area,
      area_name: String(r['Nombre Area']).trim(),
      subarea,
      subarea_name: String(r['Nombre Subarea']).trim(),
      type,
      question_text: String(r.Pregunta).trim(),
      option_a: String(r['Opcion A']).trim(),
      option_b: String(r['Opcion B']).trim(),
      option_c: String(r['Opcion C']).trim(),
      correct_answer: correct,
      explanation: r.Explicacion ? String(r.Explicacion).trim() : null,
      difficulty,
      image_url: null, // Diferido: las imagenes se suben a Storage despues
      tags: tagsArr.length > 0 ? tagsArr : null,
      is_pilot: piloto,
      is_active: true,
      is_deleted: false,
      times_seen: Number(r['Veces visto']) || 0,
      times_correct: Number(r['Veces correcto']) || 0,
      stimulus_id: stimulusId,
    },
    stimulusId,
  }
}

const valid = []
const invalid = []
for (const r of rawRows) {
  const res = normalizeRow(r)
  if (res.ok) valid.push(res.ok)
  else invalid.push({ id: r.ID, errors: res.errors, text: String(r.Pregunta || '').slice(0, 60) })
}

console.log(`\nValidacion: ${valid.length} ok / ${invalid.length} errores`)
if (invalid.length) {
  console.log('Errores (primeros 10):')
  invalid.slice(0, 10).forEach((i) => console.log(`  - ${i.id}: ${i.errors.join('; ')} | ${i.text}`))
  if (invalid.length > 10) console.log(`  ... y ${invalid.length - 10} mas`)
}

// Distribuciones
const dist = {}
const diffDist = { easy: 0, medium: 0, hard: 0 }
const ansDist = { a: 0, b: 0, c: 0 }
const tipoDist = {}
for (const r of valid) {
  const k = `${r.section}/A${r.area}/s${r.subarea}`
  dist[k] = (dist[k] || 0) + 1
  diffDist[r.difficulty]++
  ansDist[r.correct_answer]++
  tipoDist[r.type] = (tipoDist[r.type] || 0) + 1
}
console.log('\nDistribucion por subarea:')
Object.entries(dist).sort().forEach(([k, v]) => console.log(`  ${k.padEnd(25)} ${v}`))
console.log('Dificultad:', diffDist)
console.log('Respuesta correcta:', ansDist)
console.log('Tipo:', tipoDist)

// ============================================================
// 2) Estimulos: descubrir cuales faltan
// ============================================================
const stimulusIdsInCsv = [...new Set(valid.map((r) => r.stimulus_id).filter(Boolean))]
console.log(`\nEstimulos referenciados en CSV: ${stimulusIdsInCsv.length}`)

const { data: existingStimuli, error: stimErr } = await supabase
  .from('stimuli')
  .select('id')
  .in('id', stimulusIdsInCsv.length > 0 ? stimulusIdsInCsv : ['00000000-0000-0000-0000-000000000000'])
if (stimErr) {
  console.error('Error leyendo stimuli:', stimErr.message)
  process.exit(1)
}
const existingIds = new Set((existingStimuli ?? []).map((s) => s.id))
const missingStimulusIds = stimulusIdsInCsv.filter((id) => !existingIds.has(id))
console.log(`Estimulos existentes en DB: ${existingIds.size} | Faltantes a crear: ${missingStimulusIds.length}`)

// Para cada estimulo faltante, inferir subarea_context por la primera pregunta multi que lo usa
function inferContext(stimulusId) {
  const ref = valid.find((r) => r.stimulus_id === stimulusId)
  if (!ref) return 'estudio'
  if (ref.section === 'transversal' && ref.area === 1) {
    if (ref.subarea === 1) return 'estudio'
    if (ref.subarea === 2) return 'literario'
    if (ref.subarea === 3) return 'participacion_social'
  }
  return 'estudio'
}

const stimuliPayload = missingStimulusIds.map((id) => ({
  id,
  title: `Estimulo ${id.slice(0, 8)}`,
  text_type: 'articulo_investigacion',
  subarea_context: inferContext(id),
  body: '[Pendiente de capturar el texto completo del estimulo. Editable desde /admin/stimuli o via SQL.]',
  is_active: true,
}))

// ============================================================
// 3) IDs del CSV (para Paso 4)
// ============================================================
const csvIdsSet = new Set(valid.map((r) => r.id))
console.log(`\nIDs unicos en CSV: ${csvIdsSet.size}`)

// Ver cuantos existirian para soft-delete
const { data: allActive } = await supabase
  .from('questions')
  .select('id')
  .eq('is_deleted', false)
const currentIds = (allActive ?? []).map((r) => r.id)
const toSoftDelete = currentIds.filter((id) => !csvIdsSet.has(id))
const willInsert = valid.filter((r) => !currentIds.includes(r.id)).length
const willUpdate = valid.length - willInsert
console.log(`Preguntas a INSERT (nuevas): ${willInsert}`)
console.log(`Preguntas a UPDATE (overlap): ${willUpdate}`)
console.log(`Preguntas viejas a soft-delete: ${toSoftDelete.length}`)

if (!APPLY) {
  console.log('\nDRY RUN terminado. Para aplicar: node scripts/import-csv-bank.mjs --apply\n')
  process.exit(0)
}

// ============================================================
// APPLY
// ============================================================

// 2.a) Insertar estimulos placeholder
if (stimuliPayload.length > 0) {
  console.log(`\nInsertando ${stimuliPayload.length} estimulos placeholder...`)
  const { error } = await supabase.from('stimuli').insert(stimuliPayload)
  if (error) {
    console.error('Error insertando estimulos:', error.message)
    process.exit(1)
  }
  console.log('  OK')
  console.log('\nIDs de estimulos creados (editar despues en /admin/stimuli):')
  stimuliPayload.forEach((s) => console.log(`  ${s.id}  (subarea_context: ${s.subarea_context})`))
}

// 3.a) UPSERT preguntas en batches
console.log(`\nUPSERT de ${valid.length} preguntas en batches de 100...`)
const BATCH = 100
let upserted = 0
for (let i = 0; i < valid.length; i += BATCH) {
  const chunk = valid.slice(i, i + BATCH).map(({ stimulus_id, ...rest }) => ({
    ...rest,
    stimulus_id,
    updated_at: new Date().toISOString(),
  }))
  const { error, count } = await supabase
    .from('questions')
    .upsert(chunk, { onConflict: 'id', count: 'exact' })
  if (error) {
    console.error(`Error batch ${Math.floor(i / BATCH) + 1}:`, error.message)
    process.exit(1)
  }
  upserted += count ?? chunk.length
  console.log(`  Batch ${Math.floor(i / BATCH) + 1}: +${count ?? chunk.length} (acum ${upserted})`)
}

// 4) Soft-delete viejas no presentes
if (toSoftDelete.length > 0) {
  console.log(`\nSoft-delete de ${toSoftDelete.length} preguntas viejas...`)
  const DEL_BATCH = 200
  let deleted = 0
  for (let i = 0; i < toSoftDelete.length; i += DEL_BATCH) {
    const chunk = toSoftDelete.slice(i, i + DEL_BATCH)
    const { error, count } = await supabase
      .from('questions')
      .update({ is_active: false, is_deleted: true, updated_at: new Date().toISOString() })
      .in('id', chunk)
      .select('id', { count: 'exact', head: true })
    if (error) {
      console.error(`Error soft-delete batch:`, error.message)
      process.exit(1)
    }
    deleted += count ?? chunk.length
    console.log(`  Batch ${Math.floor(i / DEL_BATCH) + 1}: -${count ?? chunk.length} (acum ${deleted})`)
  }
}

console.log('\nVerificacion final:')
const { count: activasCount } = await supabase
  .from('questions')
  .select('*', { count: 'exact', head: true })
  .eq('is_active', true)
  .eq('is_deleted', false)
const { count: totalCount } = await supabase
  .from('questions')
  .select('*', { count: 'exact', head: true })
console.log(`  Activas: ${activasCount}`)
console.log(`  Total fisicas: ${totalCount}`)
console.log('\nLISTO. Siguiente paso: node scripts/rebalance-db-correct-answers.mjs --apply\n')
