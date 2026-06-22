'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  orgMetaSchema,
  assignOrgRoleSchema,
  type OrgMetaInput,
  type AssignOrgRoleInput,
} from '@/lib/validations/org.schema'

type ActionResult<T = { id: string }> =
  | { success: true; data: T }
  | { success: false; error: string }

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' as const, supabase, user: null }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { error: 'Requiere rol admin' as const, supabase, user: null }
  return { error: null, supabase, user }
}

export async function createOrg(input: OrgMetaInput): Promise<ActionResult> {
  const parsed = orgMetaSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { data, error } = await supabase.from('organizations').insert(parsed.data).select('id').single()
  if (error || !data) return { success: false, error: error?.message ?? 'Error al crear organizacion' }

  revalidatePath('/admin/orgs')
  return { success: true, data: { id: data.id } }
}

export async function updateOrg(id: string, input: OrgMetaInput): Promise<ActionResult> {
  const parsed = orgMetaSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { error } = await supabase.from('organizations').update(parsed.data).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/orgs')
  revalidatePath(`/admin/orgs/${id}`)
  return { success: true, data: { id } }
}

export async function deleteOrg(id: string): Promise<ActionResult> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', id)
  if ((count ?? 0) > 0) {
    return { success: false, error: `No se puede borrar: la organizacion tiene ${count} miembros.` }
  }

  const { error } = await supabase.from('organizations').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/orgs')
  return { success: true, data: { id } }
}

/**
 * Asigna (o cambia) el rol organizacional de un usuario por correo:
 * lo mete a la organización con el org_role indicado.
 */
export async function assignOrgRole(input: AssignOrgRoleInput): Promise<ActionResult> {
  const parsed = assignOrgRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { data: target } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', parsed.data.email)
    .single()
  if (!target) return { success: false, error: 'No existe un usuario con ese correo' }

  const { error } = await supabase
    .from('profiles')
    .update({ organization_id: parsed.data.orgId, org_role: parsed.data.orgRole })
    .eq('id', target.id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/orgs/${parsed.data.orgId}`)
  return { success: true, data: { id: target.id } }
}

export async function removeOrgMember(userId: string, orgId: string): Promise<ActionResult> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { error } = await supabase
    .from('profiles')
    .update({ organization_id: null, org_role: null })
    .eq('id', userId)
    .eq('organization_id', orgId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/orgs/${orgId}`)
  return { success: true, data: { id: userId } }
}
