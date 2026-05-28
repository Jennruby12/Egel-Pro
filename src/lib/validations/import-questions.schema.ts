import { z } from 'zod'

/**
 * Schema para cada fila del XLSX de importacion.
 * Mas permisivo que questionFormSchema porque viene de un archivo externo:
 * normaliza tipos (string -> number, strip whitespace, lowercase).
 */
export const importRowSchema = z.object({
  section: z.string().transform((s) => s.trim().toLowerCase()).pipe(z.enum(['disciplinar', 'transversal'])),
  area: z.coerce.number().int().min(1).max(4),
  area_name: z.string().min(1).max(120),
  subarea: z.coerce.number().int().min(1).max(5),
  subarea_name: z.string().min(1).max(200),
  type: z
    .string()
    .optional()
    .transform((s) => (s ?? 'single').trim().toLowerCase())
    .pipe(z.enum(['single', 'multireactivo'])),
  question_text: z.string().min(10).max(2000),
  option_a: z.string().min(1).max(500),
  option_b: z.string().min(1).max(500),
  option_c: z.string().min(1).max(500),
  correct_answer: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.enum(['a', 'b', 'c'])),
  explanation: z.string().optional().transform((s) => (s && s.trim() !== '' ? s : null)),
  difficulty: z
    .string()
    .optional()
    .transform((s) => (s ?? 'medium').trim().toLowerCase())
    .pipe(z.enum(['easy', 'medium', 'hard'])),
  is_pilot: z.coerce.boolean().optional().default(false),
})

export type ImportRowInput = z.input<typeof importRowSchema>
export type ImportRowOutput = z.output<typeof importRowSchema>

export type ImportRowResult =
  | { rowIndex: number; ok: true; data: ImportRowOutput }
  | { rowIndex: number; ok: false; errors: string[]; raw: Record<string, unknown> }
