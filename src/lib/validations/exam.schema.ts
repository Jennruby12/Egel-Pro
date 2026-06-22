import { z } from 'zod'

/** Metadatos de un examen (tabla exams). */
export const examMetaSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug muy corto')
    .regex(/^[a-z0-9-]+$/, 'Solo minusculas, numeros y guiones'),
  code: z.string().min(2, 'Codigo requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  total_questions: z.coerce.number().int().min(0),
  disciplinar_questions: z.coerce.number().int().min(0),
  transversal_questions: z.coerce.number().int().min(0),
  sessions: z.coerce.number().int().min(1).max(6),
  session_seconds: z.coerce.number().int().min(0),
  pilot_pct: z.coerce.number().min(0).max(1),
  options_per_question: z.coerce.number().int().min(2).max(6),
  is_active: z.boolean(),
})
export type ExamMetaInput = z.infer<typeof examMetaSchema>

/** Area de un examen (tabla exam_areas). */
export const examAreaSchema = z.object({
  exam_id: z.string().uuid(),
  section: z.enum(['disciplinar', 'transversal']),
  area_num: z.coerce.number().int().min(1),
  name: z.string().min(1, 'Nombre requerido'),
  total_questions: z.coerce.number().int().min(0),
  color: z.string().trim().optional().nullable(),
  color_class: z.string().trim().optional().nullable(),
})
export type ExamAreaInput = z.infer<typeof examAreaSchema>

/** Subarea de un area (tabla exam_subareas). */
export const examSubareaSchema = z.object({
  exam_area_id: z.string().uuid(),
  subarea_num: z.coerce.number().int().min(1),
  name: z.string().min(1, 'Nombre requerido'),
  questions: z.coerce.number().int().min(0),
})
export type ExamSubareaInput = z.infer<typeof examSubareaSchema>

/** Cambiar el examen activo del usuario. */
export const setActiveExamSchema = z.object({
  examId: z.string().uuid(),
})
