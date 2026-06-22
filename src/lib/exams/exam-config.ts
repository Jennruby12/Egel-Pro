/**
 * Configuracion de examen cargada desde BD (tablas exams / exam_areas /
 * exam_subareas). Reemplaza el hardcode de `@/lib/constants/egel` para que el
 * codigo lea la estructura del examen ACTIVO, no un examen fijo.
 *
 * `egel.ts` se mantiene como seed/fallback ISOFT y hogar de los umbrales
 * estandar CENEVAL (getPerformanceLevel), que son iguales para todo EGEL.
 */
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

/** ID fijo del examen semilla EGEL ISOFT (ver migracion 040_exams.sql). */
export const ISOFT_EXAM_ID = '11111111-1111-4111-8111-111111111111'

export type ExamSection = 'disciplinar' | 'transversal'

export type ExamSubarea = {
  subarea: number
  name: string
  questions: number
}

export type ExamArea = {
  area: number
  section: ExamSection
  name: string
  totalQuestions: number
  color: string | null
  colorClass: string | null
  subareas: ExamSubarea[]
}

export type ExamMeta = {
  totalQuestions: number
  disciplinarQuestions: number
  transversalQuestions: number
  sessions: number
  sessionDurationSeconds: number
  pilotPercentage: number
  optionsPerQuestion: number
}

export type ExamConfig = {
  id: string
  slug: string
  code: string
  name: string
  exam: ExamMeta
  disciplinarAreas: ExamArea[]
  transversalAreas: ExamArea[]
}

/**
 * Carga la configuracion completa de un examen desde BD. Memoizado por request
 * con React cache() para no repetir las queries en el mismo render.
 * Si no se pasa examId, usa ISOFT. Si el examen no existe, devuelve null.
 */
export const getExamConfig = cache(async function getExamConfig(
  examId: string = ISOFT_EXAM_ID,
): Promise<ExamConfig | null> {
  const supabase = await createClient()

  const [examResult, areasResult, subareasResult] = await Promise.all([
    supabase.from('exams').select('*').eq('id', examId).single(),
    supabase
      .from('exam_areas')
      .select('*')
      .eq('exam_id', examId)
      .order('section', { ascending: true })
      .order('area_num', { ascending: true }),
    supabase
      .from('exam_subareas')
      .select('*, exam_areas!inner(exam_id)')
      .eq('exam_areas.exam_id', examId)
      .order('subarea_num', { ascending: true }),
  ])

  const exam = examResult.data
  if (!exam) return null

  const subareasByAreaId = new Map<string, ExamSubarea[]>()
  for (const s of subareasResult.data ?? []) {
    const list = subareasByAreaId.get(s.exam_area_id) ?? []
    list.push({ subarea: s.subarea_num, name: s.name, questions: s.questions })
    subareasByAreaId.set(s.exam_area_id, list)
  }

  const toArea = (a: NonNullable<typeof areasResult.data>[number]): ExamArea => ({
    area: a.area_num,
    section: a.section as ExamSection,
    name: a.name,
    totalQuestions: a.total_questions,
    color: a.color,
    colorClass: a.color_class,
    subareas: (subareasByAreaId.get(a.id) ?? []).sort((x, y) => x.subarea - y.subarea),
  })

  const areas = (areasResult.data ?? []).map(toArea)

  return {
    id: exam.id,
    slug: exam.slug,
    code: exam.code,
    name: exam.name,
    exam: {
      totalQuestions: exam.total_questions,
      disciplinarQuestions: exam.disciplinar_questions,
      transversalQuestions: exam.transversal_questions,
      sessions: exam.sessions,
      sessionDurationSeconds: exam.session_seconds,
      pilotPercentage: Number(exam.pilot_pct),
      optionsPerQuestion: exam.options_per_question,
    },
    disciplinarAreas: areas.filter((a) => a.section === 'disciplinar').sort((a, b) => a.area - b.area),
    transversalAreas: areas.filter((a) => a.section === 'transversal').sort((a, b) => a.area - b.area),
  }
})

/**
 * Devuelve el examen activo del usuario (profiles.active_exam_id). Si el perfil
 * no tiene examen activo, cae a ISOFT. Memoizado por request.
 */
export const getActiveExamId = cache(async function getActiveExamId(
  userId: string,
): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('active_exam_id')
    .eq('id', userId)
    .single()
  return data?.active_exam_id ?? ISOFT_EXAM_ID
})

/** Atajo: config del examen activo del usuario. */
export async function getActiveExamConfig(userId: string): Promise<ExamConfig | null> {
  return getExamConfig(await getActiveExamId(userId))
}

// =====================================================
// Helpers parametrizados por config (puros)
// =====================================================

export function getAreaById(
  config: ExamConfig,
  areaId: number,
  section: ExamSection = 'disciplinar',
): ExamArea | undefined {
  const source = section === 'transversal' ? config.transversalAreas : config.disciplinarAreas
  return source.find((a) => a.area === areaId)
}

export function getSubareaById(
  config: ExamConfig,
  areaId: number,
  subareaId: number,
  section: ExamSection = 'disciplinar',
): ExamSubarea | undefined {
  return getAreaById(config, areaId, section)?.subareas.find((s) => s.subarea === subareaId)
}

/**
 * Pesos de distribucion por area disciplinar (cantidad oficial de reactivos).
 * Alimenta `distributeQuestionsByArea` en scoring.ts.
 */
export function getAreaWeights(config: ExamConfig): Record<number, number> {
  const weights: Record<number, number> = {}
  for (const a of config.disciplinarAreas) weights[a.area] = a.totalQuestions
  return weights
}

export type SimulacroSlot = {
  section: ExamSection
  area: number
  count: number
}

/**
 * Construye los slots del simulacro repartiendo, por area, sus reactivos entre
 * las N sesiones del examen. Usa metodo de mayor residuo balanceando ademas el
 * total por sesion (para que las sesiones queden lo mas parejas posible).
 *
 * Conserva el total del examen y los totales por area exactos; el reparto por
 * sesion es algoritmico (puede diferir 1-2 reactivos del antiguo hand-tuned).
 *
 * @returns Array de longitud `sessions`; cada elemento es la lista de slots de
 * esa sesion (en orden disciplinar -> transversal, por area).
 */
export function buildSimulacroSlots(config: ExamConfig): SimulacroSlot[][] {
  const sessions = Math.max(1, config.exam.sessions)
  const allAreas = [...config.disciplinarAreas, ...config.transversalAreas]
  const result: SimulacroSlot[][] = Array.from({ length: sessions }, () => [])

  // Carga acumulada por sesion para balancear desempates.
  const sessionLoad = new Array<number>(sessions).fill(0)

  for (const area of allAreas) {
    // Reparto base por mayor residuo de los reactivos del area entre sesiones.
    const base = Math.floor(area.totalQuestions / sessions)
    let remainder = area.totalQuestions - base * sessions
    const counts = new Array<number>(sessions).fill(base)

    // Asignar el sobrante a las sesiones menos cargadas (balanceo global).
    const order = Array.from({ length: sessions }, (_, i) => i).sort(
      (a, b) => sessionLoad[a] - sessionLoad[b],
    )
    for (const idx of order) {
      if (remainder <= 0) break
      counts[idx] += 1
      remainder -= 1
    }

    for (let i = 0; i < sessions; i++) {
      sessionLoad[i] += counts[i]
      if (counts[i] > 0) {
        result[i].push({ section: area.section, area: area.area, count: counts[i] })
      }
    }
  }

  return result
}
