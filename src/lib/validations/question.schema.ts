import { z } from 'zod'

const SECTIONS = ['disciplinar', 'transversal'] as const
const TYPES = ['single', 'multireactivo'] as const
const ANSWERS = ['a', 'b', 'c'] as const
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

// Patrones reutilizables para media opcional (imagen URL / diagrama Mermaid)
const optionalImageUrl = z.string().url('URL invalida').max(1000).optional().or(z.literal(''))
const optionalDiagram = z.string().max(5000).optional().or(z.literal(''))

export const questionFormSchema = z
  .object({
    section: z.enum(SECTIONS),
    area: z.coerce.number().int().min(1).max(4),
    area_name: z.string().min(1, 'Nombre del area requerido').max(120),
    subarea: z.coerce.number().int().min(1).max(5),
    subarea_name: z.string().min(1, 'Nombre de la subarea requerido').max(200),
    type: z.enum(TYPES),
    stimulus_id: z.string().uuid().nullable().optional().or(z.literal('')),
    question_text: z.string().min(10, 'La pregunta debe tener al menos 10 caracteres').max(2000),
    // El texto de la opcion puede quedar vacio si la opcion es puramente
    // visual (imagen o diagrama). El refine de abajo garantiza que cada
    // opcion tenga texto O media.
    option_a: z.string().max(500).optional().or(z.literal('')),
    option_b: z.string().max(500).optional().or(z.literal('')),
    option_c: z.string().max(500).optional().or(z.literal('')),
    correct_answer: z.enum(ANSWERS),
    explanation: z.string().max(2000).optional().or(z.literal('')),
    difficulty: z.enum(DIFFICULTIES),
    tags: z.array(z.string()),
    is_active: z.boolean(),
    is_pilot: z.boolean(),
    // Diagrama del enunciado en formato Mermaid (UML/clases/PERT). Opcional.
    diagram: optionalDiagram,
    // Imagen del enunciado (URL absoluta). Opcional.
    image_url: optionalImageUrl,
    // Media por opcion (preguntas tipo "elige la imagen/diagrama"). Opcional.
    option_a_image: optionalImageUrl,
    option_b_image: optionalImageUrl,
    option_c_image: optionalImageUrl,
    option_a_diagram: optionalDiagram,
    option_b_diagram: optionalDiagram,
    option_c_diagram: optionalDiagram,
  })
  .superRefine((data, ctx) => {
    // Cada opcion debe aportar contenido: texto O imagen O diagrama.
    const checks: Array<{ letter: 'a' | 'b' | 'c'; text?: string; image?: string; diagram?: string }> = [
      { letter: 'a', text: data.option_a, image: data.option_a_image, diagram: data.option_a_diagram },
      { letter: 'b', text: data.option_b, image: data.option_b_image, diagram: data.option_b_diagram },
      { letter: 'c', text: data.option_c, image: data.option_c_image, diagram: data.option_c_diagram },
    ]
    for (const c of checks) {
      const hasContent = Boolean(c.text?.trim()) || Boolean(c.image?.trim()) || Boolean(c.diagram?.trim())
      if (!hasContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`option_${c.letter}`],
          message: `Opcion ${c.letter.toUpperCase()} requiere texto, imagen o diagrama`,
        })
      }
    }
  })

export type QuestionFormInput = z.infer<typeof questionFormSchema>

export const deleteQuestionSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteQuestionInput = z.infer<typeof deleteQuestionSchema>
