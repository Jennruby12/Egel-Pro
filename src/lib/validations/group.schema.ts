import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().trim().min(2, 'Nombre muy corto').max(80),
  examId: z.string().uuid('Examen invalido'),
})
export type CreateGroupInput = z.infer<typeof createGroupSchema>

export const joinGroupSchema = z.object({
  code: z.string().trim().min(4, 'Codigo invalido').max(12),
})
export type JoinGroupInput = z.infer<typeof joinGroupSchema>
