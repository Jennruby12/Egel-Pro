#!/usr/bin/env node
/**
 * Rebalancea las correct_answer de un JSON de preguntas distribuyendolas
 * entre A/B/C de forma equitativa. Hace swap de option_a/b/c y de correct_answer
 * en sincronia para mantener la logica intacta.
 *
 * Determinista: usa el indice de la pregunta para decidir el target,
 * asi correr el script dos veces produce el mismo resultado.
 *
 * Uso:
 *   node scripts/rebalance-correct-answers.mjs scripts/data/ai-questions-phase2.json
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const jsonPath = process.argv[2]
if (!jsonPath) {
  console.error('Falta path. Uso: node scripts/rebalance-correct-answers.mjs <path.json>')
  process.exit(1)
}

const fullPath = resolve(ROOT, jsonPath)
const data = JSON.parse(readFileSync(fullPath, 'utf8'))

const TARGETS = ['a', 'b', 'c']

function swap(q, from, to) {
  if (from === to) return q
  const optKey = (l) => `option_${l}`
  const tmp = q[optKey(from)]
  q[optKey(from)] = q[optKey(to)]
  q[optKey(to)] = tmp
  q.correct_answer = to
  return q
}

// Estrategia: cada pregunta recibe un target round-robin segun su indice.
// Si su correct_answer ya es target, no hace nada. Si no, hace swap.
const before = { a: 0, b: 0, c: 0 }
data.forEach((q) => { before[q.correct_answer] = (before[q.correct_answer] || 0) + 1 })

data.forEach((q, i) => {
  const target = TARGETS[i % 3]
  swap(q, q.correct_answer, target)
})

const after = { a: 0, b: 0, c: 0 }
data.forEach((q) => { after[q.correct_answer] = (after[q.correct_answer] || 0) + 1 })

writeFileSync(fullPath, JSON.stringify(data, null, 2) + '\n', 'utf8')

console.log(`Rebalanceado: ${jsonPath}`)
console.log(`  Antes:  A=${before.a} B=${before.b} C=${before.c}`)
console.log(`  Despues: A=${after.a} B=${after.b} C=${after.c}`)
