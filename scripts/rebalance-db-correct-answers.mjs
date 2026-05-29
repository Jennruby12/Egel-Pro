#!/usr/bin/env node
/**
 * Rebalancea la distribucion de correct_answer en la tabla questions de DB.
 *
 * Estrategia determinista: cada pregunta recibe un target letra basado en el
 * indice de su posicion ordenada por id (round-robin a/b/c). Si el target
 * coincide con la correct_answer actual, no se toca; si no, se intercambia
 * la opcion actual con la del target y se actualiza correct_answer.
 *
 * Las explicaciones quedan intactas (consulta SQL previa confirmo que ninguna
 * referencia letras de opcion).
 *
 * Uso:
 *   node scripts/rebalance-db-correct-answers.mjs            # dry run (default)
 *   node scripts/rebalance-db-correct-answers.mjs --apply    # ejecuta UPDATEs
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

console.log(`Modo: ${APPLY ? 'APPLY' : 'DRY RUN'}\n`)

// Traer TODAS las preguntas
console.log('Cargando preguntas...')
const all = []
let from = 0
const PAGE = 1000
while (true) {
  const { data, error } = await supabase
    .from('questions')
    .select('id, option_a, option_b, option_c, correct_answer')
    .eq('is_deleted', false)
    .order('id', { ascending: true })
    .range(from, from + PAGE - 1)
  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
  all.push(...data)
  if (data.length < PAGE) break
  from += PAGE
}
console.log(`  ${all.length} preguntas\n`)

const before = { a: 0, b: 0, c: 0 }
all.forEach((q) => { before[q.correct_answer] = (before[q.correct_answer] || 0) + 1 })
console.log('Antes:')
Object.entries(before).forEach(([k, v]) => console.log(`  ${k}: ${v} (${Math.round((v / all.length) * 100)}%)`))

const LETTERS = ['a', 'b', 'c']
const optKey = (l) => `option_${l}`

// Asignar target round-robin segun orden por id
const updates = []
const after = { a: 0, b: 0, c: 0 }
all.forEach((q, i) => {
  const target = LETTERS[i % 3]
  if (q.correct_answer !== target) {
    // Swap opciones
    const updated = {
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      correct_answer: target,
    }
    const tmp = updated[optKey(q.correct_answer)]
    updated[optKey(q.correct_answer)] = updated[optKey(target)]
    updated[optKey(target)] = tmp
    updates.push({ id: q.id, ...updated })
  }
  after[target]++
})

console.log('\nDespues (esperado):')
Object.entries(after).forEach(([k, v]) => console.log(`  ${k}: ${v} (${Math.round((v / all.length) * 100)}%)`))

console.log(`\nUpdates necesarios: ${updates.length}`)

if (!APPLY) {
  console.log('\nDry run terminado. Re-ejecuta con --apply para escribir.')
  process.exit(0)
}

// Ejecutar UPDATEs uno por uno (Supabase no soporta bulk update con datos diferentes por row)
console.log('\nAplicando UPDATEs...')
let done = 0
let failed = 0
for (const u of updates) {
  const { id, ...payload } = u
  const { error } = await supabase.from('questions').update(payload).eq('id', id)
  if (error) {
    console.error(`  FAIL id=${id}: ${error.message}`)
    failed++
  } else {
    done++
  }
  if (done % 50 === 0) console.log(`  ${done}/${updates.length}...`)
}

console.log(`\nResultado: ${done} OK, ${failed} fallos.`)

// Verificacion post
const final = { a: 0, b: 0, c: 0 }
const { data: post } = await supabase
  .from('questions')
  .select('correct_answer')
  .eq('is_deleted', false)
for (const r of post ?? []) final[r.correct_answer]++
console.log('\nVerificacion post:')
Object.entries(final).forEach(([k, v]) => console.log(`  ${k}: ${v} (${Math.round((v / (post?.length ?? 1)) * 100)}%)`))
