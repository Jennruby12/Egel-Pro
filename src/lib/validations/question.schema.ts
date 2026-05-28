import { z } from 'zod'

const SECTIONS = ['disciplinar', 'transversal'] as const
const TYPES = ['single', 'multireactivo'] as const
const ANSWERS = ['a', 'b', 'c'] as const
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

export const questionFormSchema = z.object({
  section: z.enum(SECTIONS),
  area: z.coerce.number().int().min(1).max(4),
  area_name: z.string().min(1, 'Nombre del area requerido').max(120),
  subarea: z.coerce.number().int().min(1).max(5),
  subarea_name: z.string().min(1, 'Nombre de la subarea requerido').max(200),
  type: z.enum(TYPES),
  stimulus_id: z.string().uuid().nullable().optional().or(z.literal('')),
  question_text: z.string().min(10, 'La pregunta debe tener al menos 10 caracteres').max(2000),
  option_a: z.string().min(1, 'Opcion A requerida').max(500),
  option_b: z.string().min(1, 'Opcion B requerida').max(500),
  option_c: z.string().min(1, 'Opcion C requerida').max(500),
  correct_answer: z.enum(ANSWERS),
  explanation: z.string().max(2000).optional().or(z.literal('')),
  difficulty: z.enum(DIFFICULTIES),
  tags: z.array(z.string()),
  is_active: z.boolean(),
  is_pilot: z.boolean(),
})

export type QuestionFormInput = z.infer<typeof questionFormSchema>

export const deleteQuestionSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteQuestionInput = z.infer<typeof deleteQuestionSchema>
