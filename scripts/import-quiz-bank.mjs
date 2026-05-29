#!/usr/bin/env node
/**
 * Importa las 16 hojas XLSX de C:\Users\leona\EGEL\03-Quizzes\ al banco de preguntas.
 *
 * Uso:
 *   node scripts/import-quiz-bank.mjs            # dry run (default)
 *   node scripts/import-quiz-bank.mjs --apply    # inserta a Supabase
 *
 * Idempotente: omite filas cuyo question_text ya existe (case-sensitive).
 */

import XLSX from 'xlsx'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const QUIZ_DIR = 'C:/Users/leona/EGEL/03-Quizzes'

// Cargar .env.local manualmente (sin dotenv para no agregar dep)
const envText = readFileSync(resolve(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(
  envText
    .split('\n')
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
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const APPLY = process.argv.includes('--apply')

// Mapeo oficial: nombre de archivo → metadata. Los nombres de area/subarea
// matchean exactamente los ya existentes en DB (sin acentos, mismas comas).
const FILE_MAP = {
  'Quiz-01_Requerimientos-de-Software.xlsx': {
    section: 'disciplinar', area: 1, area_name: 'Analisis de Sistemas de Software',
    subarea: 1, subarea_name: 'Tipos de requerimientos',
  },
  'Quiz-02_Diagramas-UML-Casos-Uso-Secuencia.xlsx': {
    section: 'disciplinar', area: 1, area_name: 'Analisis de Sistemas de Software',
    subarea: 3, subarea_name: 'Tecnicas y herramientas de documentacion de requerimientos',
  },
  'Quiz-03_Analisis-de-Factibilidad.xlsx': {
    section: 'disciplinar', area: 1, area_name: 'Analisis de Sistemas de Software',
    subarea: 2, subarea_name: 'Tecnicas y herramientas para obtencion, analisis, priorizacion y validacion',
  },
  'Quiz-04_Modelado-de-Datos-ER-Normalizacion.xlsx': {
    section: 'disciplinar', area: 1, area_name: 'Analisis de Sistemas de Software',
    subarea: 3, subarea_name: 'Tecnicas y herramientas de documentacion de requerimientos',
  },
  'Quiz-05_Arquitectura-de-Software.xlsx': {
    section: 'disciplinar', area: 2, area_name: 'Diseno de Sistemas de Software',
    subarea: 1, subarea_name: 'Diseno arquitectonico de software',
  },
  'Quiz-06_Patrones-de-Diseno-GoF.xlsx': {
    section: 'disciplinar', area: 2, area_name: 'Diseno de Sistemas de Software',
    subarea: 2, subarea_name: 'Diseno de modulos, componentes y de datos',
  },
  'Quiz-07_Principios-SOLID-y-Diseno.xlsx': {
    section: 'disciplinar', area: 2, area_name: 'Diseno de Sistemas de Software',
    subarea: 2, subarea_name: 'Diseno de modulos, componentes y de datos',
  },
  'Quiz-15_Diseno-Interfaces-Usabilidad.xlsx': {
    section: 'disciplinar', area: 2, area_name: 'Diseno de Sistemas de Software',
    subarea: 3, subarea_name: 'Diseno de interfaces',
  },
  'Quiz-08_Pruebas-de-Software.xlsx': {
    section: 'disciplinar', area: 3, area_name: 'Desarrollo de Sistemas de Software',
    subarea: 3, subarea_name: 'Entornos de desarrollo',
  },
  'Quiz-09_Implementacion-y-Paradigmas.xlsx': {
    section: 'disciplinar', area: 3, area_name: 'Desarrollo de Sistemas de Software',
    subarea: 2, subarea_name: 'Paradigmas de programacion',
  },
  'Quiz-10_Gestion-de-Proyectos-PMBOK.xlsx': {
    section: 'disciplinar', area: 4, area_name: 'Gestion de Proyectos de Software',
    subarea: 1, subarea_name: 'Gestion de tiempos, costos, recursos humanos y de riesgo',
  },
  'Quiz-11_Metodologias-Agiles.xlsx': {
    section: 'disciplinar', area: 4, area_name: 'Gestion de Proyectos de Software',
    subarea: 3, subarea_name: 'Metodologias de desarrollo',
  },
  'Quiz-12_Metodologias-Tradicionales.xlsx': {
    section: 'disciplinar', area: 4, area_name: 'Gestion de Proyectos de Software',
    subarea: 3, subarea_name: 'Metodologias de desarrollo',
  },
  'Quiz-13_Calidad-del-Software-CMMI-ISO.xlsx': {
    section: 'disciplinar', area: 4, area_name: 'Gestion de Proyectos de Software',
    subarea: 2, subarea_name: 'Calidad de software',
  },
  'Quiz-14_Mantenimiento-y-Configuracion.xlsx': {
    section: 'disciplinar', area: 4, area_name: 'Gestion de Proyectos de Software',
    subarea: 3, subarea_name: 'Metodologias de desarrollo',
  },
  'Quiz-16_Comprension-Lectora-Redaccion.xlsx': {
    section: 'transversal', area: 1, area_name: 'Comprension Lectora',
    subarea: 1, subarea_name: 'Ambito de estudio',
  },
}

const LETTERS = ['a', 'b', 'c']

function parseQuizFile(filename) {
  const filepath = `${QUIZ_DIR}/${filename}`
  const wb = XLSX.readFile(filepath)
  const sh = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sh, { header: 1, defval: '' })
  // Saltar header (row 0)
  const data = rows.slice(1).filter((r) => r[0] && String(r[0]).trim().length > 0)
  return data
}

function rowToQuestion(row, meta) {
  const [questionText, , opt1, opt2, opt3, , , correctIdx, , , explanation] = row
  const correct = Number(correctIdx)
  if (![1, 2, 3].includes(correct)) {
    return { error: `correct_answer "${correctIdx}" invalido` }
  }
  const opts = [opt1, opt2, opt3].map((o) => String(o ?? '').trim())
  if (!opts[0] || !opts[1] || !opts[2]) {
    return { error: 'falta alguna opcion A/B/C' }
  }
  const qtext = String(questionText).trim()
  if (qtext.length < 10 || qtext.length > 2000) {
    return { error: `question_text fuera de rango (${qtext.length} chars)` }
  }
  return {
    ok: {
      section: meta.section,
      area: meta.area,
      area_name: meta.area_name,
      subarea: meta.subarea,
      subarea_name: meta.subarea_name,
      type: 'single',
      question_text: qtext,
      option_a: opts[0],
      option_b: opts[1],
      option_c: opts[2],
      correct_answer: LETTERS[correct - 1],
      explanation: explanation ? String(explanation).trim() : null,
      difficulty: 'medium',
      is_pilot: false,
      is_active: true,
    },
  }
}

async function main() {
  console.log(`Modo: ${APPLY ? 'APPLY (inserta en DB)' : 'DRY RUN (no inserta)'}\n`)

  const allRows = []
  const errors = []
  for (const [filename, meta] of Object.entries(FILE_MAP)) {
    try {
      const raw = parseQuizFile(filename)
      let okCount = 0
      let errCount = 0
      for (const row of raw) {
        const res = rowToQuestion(row, meta)
        if (res.ok) {
          allRows.push(res.ok)
          okCount++
        } else {
          errors.push(`${filename}: ${res.error} — "${String(row[0]).slice(0, 50)}..."`)
          errCount++
        }
      }
      console.log(`  ${filename.padEnd(50)} → ${okCount} ok / ${errCount} err`)
    } catch (e) {
      console.error(`  ${filename} → FAILED: ${e.message}`)
    }
  }

  console.log(`\nTotal parseado: ${allRows.length} preguntas`)
  if (errors.length > 0) {
    console.log(`\n${errors.length} errores de parseo:`)
    errors.forEach((e) => console.log(`  - ${e}`))
  }

  // Resumen por area
  const summary = {}
  for (const r of allRows) {
    const k = `${r.section}/A${r.area}/sub${r.subarea}`
    summary[k] = (summary[k] || 0) + 1
  }
  console.log('\nDistribucion:')
  Object.entries(summary).sort().forEach(([k, v]) => console.log(`  ${k.padEnd(25)} ${v}`))

  if (!APPLY) {
    console.log('\nDry run terminado. Re-ejecuta con --apply para insertar.')
    return
  }

  // Conectar a Supabase con service role (bypassea RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Filtrar duplicados: traer textos ya existentes
  console.log('\nVerificando duplicados...')
  const existingTexts = new Set()
  let offset = 0
  const PAGE = 1000
  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select('question_text')
      .range(offset, offset + PAGE - 1)
    if (error) {
      console.error('Error consultando existentes:', error.message)
      process.exit(1)
    }
    data.forEach((d) => existingTexts.add(d.question_text))
    if (data.length < PAGE) break
    offset += PAGE
  }
  console.log(`  ${existingTexts.size} preguntas ya en DB`)

  const toInsert = allRows.filter((r) => !existingTexts.has(r.question_text))
  console.log(`  ${toInsert.length} nuevas a insertar (${allRows.length - toInsert.length} duplicadas omitidas)`)

  if (toInsert.length === 0) {
    console.log('Nada para insertar.')
    return
  }

  // Insert en batches de 100
  const BATCH = 100
  let inserted = 0
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const chunk = toInsert.slice(i, i + BATCH)
    const { error, count } = await supabase
      .from('questions')
      .insert(chunk, { count: 'exact' })
    if (error) {
      console.error(`\nError en batch ${i / BATCH + 1}:`, error.message)
      process.exit(1)
    }
    inserted += count ?? chunk.length
    console.log(`  Batch ${i / BATCH + 1}: +${count ?? chunk.length}`)
  }

  console.log(`\nOK: ${inserted} preguntas insertadas.`)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
