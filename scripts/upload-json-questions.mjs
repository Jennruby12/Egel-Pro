#!/usr/bin/env node
/**
 * Sube preguntas desde un JSON al banco. Idempotente (filtra duplicados por question_text).
 *
 * Uso:
 *   node scripts/upload-json-questions.mjs scripts/data/ai-questions-phase2.json            # dry run
 *   node scripts/upload-json-questions.mjs scripts/data/ai-questions-phase2.json --apply    # inserta
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const jsonPath = args.find((a) => a.endsWith('.json'))

if (!jsonPath) {
  console.error('Falta path al JSON. Uso: node scripts/upload-json-questions.mjs <path.json> [--apply]')
  process.exit(1)
}

// Cargar .env.local
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
  console.error('Faltan envs SUPABASE')
  process.exit(1)
}

const data = JSON.parse(readFileSync(resolve(ROOT, jsonPath), 'utf8'))
if (!Array.isArray(data)) {
  console.error('El JSON debe ser un array de preguntas')
  process.exit(1)
}

console.log(`Modo: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
console.log(`Archivo: ${jsonPath}`)
console.log(`Preguntas en JSON: ${data.length}\n`)

// Validacion minima
const errors = []
data.forEach((q, i) => {
  const required = ['section', 'area', 'area_name', 'subarea', 'subarea_name', 'question_text', 'option_a', 'option_b', 'option_c', 'correct_answer']
  for (const f of required) {
    if (q[f] === undefined || q[f] === null || q[f] === '') {
      errors.push(`Fila ${i}: falta campo '${f}'`)
    }
  }
  if (!['a', 'b', 'c'].includes(q.correct_answer)) errors.push(`Fila ${i}: correct_answer invalida (${q.correct_answer})`)
  if (!['disciplinar', 'transversal'].includes(q.section)) errors.push(`Fila ${i}: section invalida (${q.section})`)
})

if (errors.length) {
  console.error('Errores de validacion:')
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}

// Distribucion
const summary = {}
const letters = {}
data.forEach((q) => {
  const k = `${q.section}/A${q.area}/s${q.subarea}`
  summary[k] = (summary[k] || 0) + 1
  letters[q.correct_answer] = (letters[q.correct_answer] || 0) + 1
})
console.log('Distribucion por subarea:')
Object.entries(summary).sort().forEach(([k, v]) => console.log(`  ${k.padEnd(25)} ${v}`))
console.log('\nBalance de respuestas correctas:')
Object.entries(letters).sort().forEach(([k, v]) => console.log(`  ${k}: ${v} (${Math.round((v / data.length) * 100)}%)`))

if (!APPLY) {
  console.log('\nDry run terminado. Re-ejecuta con --apply para insertar.')
  process.exit(0)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
})

console.log('\nVerificando duplicados en DB...')
const existing = new Set()
let offset = 0
const PAGE = 1000
while (true) {
  const { data: rows, error } = await supabase.from('questions').select('question_text').range(offset, offset + PAGE - 1)
  if (error) {
    console.error('Error consulta:', error.message)
    process.exit(1)
  }
  rows.forEach((r) => existing.add(r.question_text))
  if (rows.length < PAGE) break
  offset += PAGE
}
console.log(`  ${existing.size} preguntas ya en DB`)

const toInsert = data
  .filter((q) => !existing.has(q.question_text))
  .map((q) => ({
    section: q.section,
    area: q.area,
    area_name: q.area_name,
    subarea: q.subarea,
    subarea_name: q.subarea_name,
    type: q.type || 'single',
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    correct_answer: q.correct_answer,
    explanation: q.explanation || null,
    difficulty: q.difficulty || 'medium',
    is_pilot: q.is_pilot || false,
    is_active: q.is_active !== false,
    stimulus_id: q.stimulus_id || null,
    image_url: q.image_url || null,
    diagram: q.diagram || null,
    tags: Array.isArray(q.tags) ? q.tags : [],
  }))

console.log(`  ${toInsert.length} nuevas (${data.length - toInsert.length} duplicadas omitidas)`)

if (toInsert.length === 0) {
  console.log('Nada nuevo para insertar.')
  process.exit(0)
}

const BATCH = 100
let inserted = 0
for (let i = 0; i < toInsert.length; i += BATCH) {
  const chunk = toInsert.slice(i, i + BATCH)
  const { error, count } = await supabase.from('questions').insert(chunk, { count: 'exact' })
  if (error) {
    console.error(`\nError en batch ${i / BATCH + 1}:`, error.message)
    process.exit(1)
  }
  inserted += count ?? chunk.length
  console.log(`  Batch ${i / BATCH + 1}: +${count ?? chunk.length}`)
}

console.log(`\nOK: ${inserted} preguntas insertadas.`)
