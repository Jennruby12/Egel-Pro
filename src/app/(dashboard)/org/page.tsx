import { redirect } from 'next/navigation'
import { Building2, Users, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/components/ui/glass-card'

export const metadata = { title: 'Mi organizacion' }
export const dynamic = 'force-dynamic'

export default async function OrgDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase
    .from('profiles')
    .select('organization_id, org_role')
    .eq('id', user.id)
    .single()

  if (!me?.organization_id) redirect('/dashboard')
  const orgId = me.organization_id

  const [{ data: org }, { data: members }, { data: groups }] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', orgId).single(),
    supabase
      .from('profiles')
      .select('id, full_name, email, org_role')
      .eq('organization_id', orgId),
    supabase
      .from('groups')
      .select('id, name, join_code, is_active, owner_id')
      .eq('organization_id', orgId),
  ])

  const memberList = members ?? []
  const groupList = groups ?? []

  // Progreso agregado de los miembros (RLS de org manager lo permite)
  const memberIds = memberList.map((m) => m.id)
  let totalAttempted = 0
  let totalCorrect = 0
  if (memberIds.length > 0) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('questions_attempted, questions_correct')
      .in('user_id', memberIds)
    for (const p of progress ?? []) {
      totalAttempted += p.questions_attempted ?? 0
      totalCorrect += p.questions_correct ?? 0
    }
  }
  const orgAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={org?.name ?? 'Mi organizacion'}
        description="Resumen de tu institucion: coordinadores, grupos y avance global."
        gradient
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Users className="h-4 w-4" />} label="Miembros" value={memberList.length} />
        <Stat icon={<GraduationCap className="h-4 w-4" />} label="Grupos" value={groupList.length} />
        <Stat icon={<Building2 className="h-4 w-4" />} label="Precision global" value={`${orgAccuracy}%`} />
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Grupos de la organizacion</h2>
        {groupList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aun no hay grupos en la organizacion.</p>
        ) : (
          <div className="grid gap-2">
            {groupList.map((g) => (
              <GlassCard key={g.id} variant="flat" padding="md" className="flex items-center justify-between">
                <span className="font-medium">{g.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{g.join_code}</span>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Miembros</h2>
        <div className="overflow-x-auto rounded-lg border border-bg-border">
          <table className="w-full text-sm">
            <thead className="bg-bg-surface text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Rol</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((m) => (
                <tr key={m.id} className="border-t border-bg-border">
                  <td className="px-4 py-2">
                    <p className="font-medium">{m.full_name || m.email}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{m.org_role ?? 'member'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <GlassCard variant="elevated" padding="lg">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="text-brand-400">{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </GlassCard>
  )
}
