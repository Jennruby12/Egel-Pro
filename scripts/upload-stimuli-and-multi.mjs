#!/usr/bin/env node
/**
 * Sube estimulos + preguntas multirreactivo.
 *
 * 1. Lee scripts/data/stimuli-phase3.json e inserta estimulos (skip si el titulo ya existe).
 * 2. Lee scripts/data/multireactivos-phase3.json, resuelve stimulus_id por titulo, inserta preguntas.
 *
 * Uso:
 *   node scripts/upload-stimuli-and-multi.mjs              # dry run
 *   node scripts/upload-stimuli-and-multi.mjs --apply      # inserta
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const APPLY = process.argv.includes('--apply')

const envText = readFileSync(resolve(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(
  envText.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => {
    const eq = l.indexOf('=')
    return [l.slice(0, eq), l.slice(eq + 1)]
  }),
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const stimuli = JSON.parse(readFileSync(resolve(ROOT, 'scripts/data/stimuli-phase3.json'), 'utf8'))
const multi = JSON.parse(readFileSync(resolve(ROOT, 'scripts/data/multireactivos-phase3.json'), 'utf8'))

console.log(`Modo: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
console.log(`Estimulos en JSON: ${stimuli.length}`)
console.log(`Multirreactivos en JSON: ${multi.length}\n`)

// Validacion estimulos
const VALID_TEXT_TYPES = ['resena_academica', 'articulo_investigacion', 'cuento', 'ensayo_literario', 'convocatoria', 'nota_informativa']
const VALID_CONTEXTS = ['estudio', 'literario', 'participacion_social']

const stimErrors = []
stimuli.forEach((s, i) => {
  if (!s.title || !s.body) stimErrors.push(`Estimulo ${i}: falta title/body`)
  if (!VALID_TEXT_TYPES.includes(s.text_type)) stimErrors.push(`Estimulo ${i}: text_type invalido (${s.text_type})`)
  if (!VALID_CONTEXTS.includes(s.subarea_context)) stimErrors.push(`Estimulo ${i}: subarea_context invalido (${s.subarea_context})`)
})

// Validacion multirreactivos
const multiErrors = []
const stimTitles = new Set(stimuli.map((s) => s.title))
multi.forEach((q, i) => {
  if (!stimTitles.has(q.stimulus_title)) multiErrors.push(`Multi ${i}: stimulus_title no existe en estimulos: "${q.stimulus_title}"`)
  if (!['a', 'b', 'c'].includes(q.correct_answer)) multiErrors.push(`Multi ${i}: correct_answer invalida`)
  for (const f of ['question_text', 'option_a', 'option_b', 'option_c']) {
    if (!q[f]) multiErrors.push(`Multi ${i}: falta ${f}`)
  }
})

if (stimErrors.length || multiErrors.length) {
  console.error('Errores de validacion:')
  ;[...stimErrors, ...multiErrors].forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}

// Distribucion de respuestas
const letters = { a: 0, b: 0, c: 0 }
multi.forEach((q) => { letters[q.correct_answer]++ })
console.log('Balance respuestas multirreactivos:')
Object.entries(letters).forEach(([k, v]) => console.log(`  ${k}: ${v} (${Math.round((v / multi.length) * 100)}%)`))

// Distribucion por subarea
const dist = {}
multi.forEach((q) => { dist[`T1/s${q.subarea}`] = (dist[`T1/s${q.subarea}`] || 0) + 1 })
console.log('\nDistribucion multi por subarea:')
Object.entries(dist).sort().forEach(([k, v]) => console.log(`  ${k}: ${v}`))

if (!APPLY) {
  console.log('\nDry run terminado.')
  process.exit(0)
}

// === INSERT ESTIMULOS ===
console.log('\nInsertando estimulos...')
const { data: existingStim } = await supabase.from('stimuli').select('id, title')
const existingTitles = new Map(existingStim?.map((s) => [s.title, s.id]) ?? [])
const titleToId = new Map(existingTitles)

const newStim = stimuli.filter((s) => !existingTitles.has(s.title))
console.log(`  ${stimuli.length - newStim.length} ya existen, ${newStim.length} nuevos`)

if (newStim.length > 0) {
  const payload = newStim.map((s) => ({
    title: s.title,
    body: s.body,
    text_type: s.text_type,
    subarea_context: s.subarea_context,
    is_active: true,
  }))
  const { data: inserted, error } = await supabase.from('stimuli').insert(payload).select('id, title')
  if (error) {
    console.error('Error insertando estimulos:', error.message)
    process.exit(1)
  }
  inserted.forEach((s) => titleToId.set(s.title, s.id))
  console.log(`  +${inserted.length} estimulos`)
}

// === INSERT MULTIRREACTIVOS ===
console.log('\nInsertando multirreactivos...')
const { data: existingQ } = await supabase
  .from('questions')
  .select('question_text')
  .eq('type', 'multireactivo')
const existingQTexts = new Set(existingQ?.map((q) => q.question_text) ?? [])

const newMulti = multi.filter((q) => !existingQTexts.has(q.question_text))
console.log(`  ${multi.length - newMulti.length} ya existen, ${newMulti.length} nuevos`)

if (newMulti.length === 0) {
  console.log('Nada nuevo.')
  process.exit(0)
}

const multiPayload = newMulti.map((q) => ({
  section: 'transversal',
  area: 1,
  area_name: 'Comprension Lectora',
  subarea: q.subarea,
  subarea_name: q.subarea_name,
  type: 'multireactivo',
  stimulus_id: titleToId.get(q.stimulus_title),
  question_text: q.question_text,
  option_a: q.option_a,
  option_b: q.option_b,
  option_c: q.option_c,
  correct_answer: q.correct_answer,
  explanation: q.explanation || null,
  difficulty: q.difficulty || 'medium',
  is_pilot: false,
  is_active: true,
}))

const { error: qError, count } = await supabase.from('questions').insert(multiPayload, { count: 'exact' })
if (qError) {
  console.error('Error insertando multirreactivos:', qError.message)
  process.exit(1)
}

console.log(`  +${count ?? multiPayload.length} multirreactivos\n`)
console.log('OK.')
