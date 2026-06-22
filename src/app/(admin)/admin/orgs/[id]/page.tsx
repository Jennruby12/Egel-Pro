import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { OrgForm } from '@/modules/admin/components/OrgForm'
import { OrgMembersManager, type OrgMember } from '@/modules/admin/components/OrgMembersManager'

export const dynamic = 'force-dynamic'

type Params = { id: string }

export default async function EditOrgPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: org, error }, { data: members }] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', id).single(),
    supabase.from('profiles').select('id, full_name, email, org_role').eq('organization_id', id),
  ])
  if (error || !org) notFound()

  const memberRows: OrgMember[] = (members ?? []).map((m) => ({
    id: m.id,
    name: m.full_name || m.email,
    email: m.email,
    orgRole: m.org_role,
  }))

  return (
    <div className="space-y-10">
      <PageHeader title={`Organizacion: ${org.name}`} description={`${memberRows.length} miembros.`} />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Datos</h2>
        <OrgForm initialData={org} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Miembros y coordinadores
        </h2>
        <p className="text-sm text-muted-foreground">
          Asigna por correo a un usuario ya registrado. <strong>owner</strong> y <strong>manager</strong> (coordinador)
          pueden ver el progreso de los alumnos de la organizacion en <code>/org</code>.
        </p>
        <OrgMembersManager orgId={org.id} members={memberRows} />
      </section>
    </div>
  )
}
