import { z } from 'zod'

export const completeOnboardingSchema = z.object({
  exam_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha invalida')
    .nullable()
    .optional()
    .or(z.literal('')),
  goal_level: z.enum(['satisfactorio', 'sobresaliente']),
  diagnostic_score: z.object({
    correct: z.number().int().nonnegative(),
    total: z.number().int().positive(),
    percent: z.number().min(0).max(100),
    byArea: z.record(z.string(), z.number().min(0).max(100)),
  }),
  university: z.string().max(120).optional().or(z.literal('')),
})

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>
