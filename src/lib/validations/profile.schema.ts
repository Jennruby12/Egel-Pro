import { z } from 'zod'

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Tu nombre debe tener al menos 2 caracteres').max(80),
  university: z.string().max(120).optional().or(z.literal('')),
  exam_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha invalida')
    .nullable()
    .optional()
    .or(z.literal('')),
  goal_level: z.enum(['satisfactorio', 'sobresaliente']),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z
  .object({
    new_password: z.string().min(8, 'Minimo 8 caracteres').max(72),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'Las contrasenas no coinciden',
    path: ['confirm_password'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export const deleteAccountSchema = z.object({
  confirmation: z.literal('ELIMINAR', {
    errorMap: () => ({ message: 'Escribe ELIMINAR para confirmar' }),
  }),
})

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
