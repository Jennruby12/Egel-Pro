import { z } from 'zod'

const QUIZ_MODES = [
  'practice',
  'quick_exam',
  'full_simulacro',
  'review',
  'speed_challenge',
  'daily_challenge',
] as const

const SECTIONS = ['disciplinar', 'transversal'] as const

// =====================================================
// START QUIZ SESSION
// =====================================================
export const startQuizSchema = z.object({
  mode: z.enum(QUIZ_MODES),
  section: z.enum(SECTIONS).default('disciplinar'),
  /** Si esta vacio, usar todas las areas */
  areas: z.array(z.number().int().min(1).max(4)).default([]),
  /** Si esta vacio, no filtrar por subareas */
  subareas: z.array(z.number().int().min(1).max(5)).default([]),
  totalQuestions: z.number().int().min(1).max(250),
  /** null = sin limite */
  timeLimitSeconds: z.number().int().positive().nullable().default(null),
})

export type StartQuizInput = z.infer<typeof startQuizSchema>

// =====================================================
// SUBMIT ANSWER
// =====================================================
export const submitAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  /** null = saltar la pregunta */
  userAnswer: z.enum(['a', 'b', 'c']).nullable(),
  timeSpentSeconds: z.number().int().nonnegative().max(7200).default(0),
  orderInQuiz: z.number().int().nonnegative(),
  isMarked: z.boolean().default(false),
})

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>

// =====================================================
// COMPLETE SESSION
// =====================================================
export const completeSessionSchema = z.object({
  sessionId: z.string().uuid(),
})

export type CompleteSessionInput = z.infer<typeof completeSessionSchema>

// =====================================================
// ABANDON SESSION
// =====================================================
export const abandonSessionSchema = z.object({
  sessionId: z.string().uuid(),
})

export type AbandonSessionInput = z.infer<typeof abandonSessionSchema>

// =====================================================
// SIMULACRO (full_simulacro: 2 sesiones de 4.5h)
// =====================================================

/** Input para arrancar la sesion 2 de un simulacro existente */
export const startSimulacroSession2Schema = z.object({
  simulacroGroupId: z.string().uuid(),
})

export type StartSimulacroSession2Input = z.infer<typeof startSimulacroSession2Schema>

/** Input para consultar el estado actual de un simulacro */
export const getSimulacroStateSchema = z.object({
  simulacroGroupId: z.string().uuid(),
})

export type GetSimulacroStateInput = z.infer<typeof getSimulacroStateSchema>
