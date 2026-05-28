import { z } from 'zod'

// Secciones y rangos validos siguiendo @/lib/constants/egel.ts
const SECTIONS = ['disciplinar', 'transversal'] as const

// Schema base usado para crear una nueva guia.
// Las reglas de negocio (area/subarea validas por seccion) se asumen del UI;
// si llega una combinacion invalida, la RLS/DB acepta el numero crudo.
export const createGuideSchema = z.object({
  section: z.enum(SECTIONS),
  area: z.coerce.number().int().min(1).max(4),
  subarea: z.coerce.number().int().min(1).max(5),
  title: z
    .string()
    .min(1, 'El titulo es requerido')
    .max(200, 'El titulo no debe exceder 200 caracteres'),
  content: z.string().min(1, 'El contenido es requerido'),
  summary: z
    .string()
    .max(1000, 'El resumen no debe exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  ceneval_tips: z
    .string()
    .max(2000, 'Los tips no deben exceder 2000 caracteres')
    .optional()
    .or(z.literal('')),
  reading_time_minutes: z.coerce
    .number()
    .int()
    .min(1, 'El tiempo de lectura debe ser al menos 1 minuto')
    .max(120, 'El tiempo de lectura no debe exceder 120 minutos'),
  is_published: z.boolean(),
})

export type CreateGuideInput = z.infer<typeof createGuideSchema>

// El schema de actualizacion es identico al de creacion; se valida por id aparte.
export const updateGuideSchema = createGuideSchema

export type UpdateGuideInput = z.infer<typeof updateGuideSchema>

export const deleteGuideSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteGuideInput = z.infer<typeof deleteGuideSchema>

export const togglePublishGuideSchema = z.object({
  id: z.string().uuid(),
  isPublished: z.boolean(),
})
export type TogglePublishGuideInput = z.infer<typeof togglePublishGuideSchema>

// =====================================================
// FLASHCARDS — Review (spaced repetition SM-2)
// =====================================================
export const submitFlashcardReviewSchema = z.object({
  flashcardId: z.string().uuid(),
  /** Calidad SM-2: 0 (nada) - 5 (perfecto). */
  quality: z.number().int().min(0).max(5),
})
export type SubmitFlashcardReviewInput = z.infer<typeof submitFlashcardReviewSchema>
