import { z } from 'zod'

// =====================================================
// SIGN UP
// =====================================================
export const signUpSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'Tu nombre debe tener al menos 2 caracteres')
      .max(80, 'Maximo 80 caracteres'),
    email: z.string().email('Email invalido').toLowerCase(),
    password: z
      .string()
      .min(8, 'La contrasena debe tener al menos 8 caracteres')
      .max(72, 'Maximo 72 caracteres'),
    confirm_password: z.string(),
    university: z.string().max(120).optional().or(z.literal('')),
    exam_date: z.string().optional().or(z.literal('')),
    accept_terms: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar los terminos para continuar' }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contrasenas no coinciden',
    path: ['confirm_password'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

// =====================================================
// SIGN IN (email + password)
// =====================================================
export const signInSchema = z.object({
  email: z.string().email('Email invalido').toLowerCase(),
  password: z.string().min(1, 'Ingresa tu contrasena'),
})

export type SignInInput = z.infer<typeof signInSchema>

// =====================================================
// MAGIC LINK
// =====================================================
export const magicLinkSchema = z.object({
  email: z.string().email('Email invalido').toLowerCase(),
})

export type MagicLinkInput = z.infer<typeof magicLinkSchema>

// =====================================================
// FORGOT PASSWORD
// =====================================================
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalido').toLowerCase(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

// =====================================================
// RESET PASSWORD (despues de click en email link)
// =====================================================
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contrasena debe tener al menos 8 caracteres')
      .max(72, 'Maximo 72 caracteres'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contrasenas no coinciden',
    path: ['confirm_password'],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
