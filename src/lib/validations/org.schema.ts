import { z } from 'zod'

export const orgMetaSchema = z.object({
  name: z.string().trim().min(2, 'Nombre requerido').max(120),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug muy corto')
    .regex(/^[a-z0-9-]+$/, 'Solo minusculas, numeros y guiones'),
  plan: z.enum(['free', 'pro', 'pro_lifetime']),
  max_students: z.coerce.number().int().min(0),
  is_active: z.boolean(),
})
export type OrgMetaInput = z.infer<typeof orgMetaSchema>

export const assignOrgRoleSchema = z.object({
  orgId: z.string().uuid(),
  email: z.string().trim().toLowerCase().email('Correo invalido'),
  orgRole: z.enum(['member', 'manager', 'owner']),
})
export type AssignOrgRoleInput = z.infer<typeof assignOrgRoleSchema>
