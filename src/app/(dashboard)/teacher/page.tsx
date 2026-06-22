import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Users, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { CreateGroupForm } from '@/modules/groups/components/CreateGroupForm'

export const metadata = { title: 'Mis grupos' }
export const dynamic = 'force-dynamic'

export default async function TeacherPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: groups }, { data: exams }] = await Promise.all([
    supabase
      .from('groups')
      .select('id, name, join_code, is_active, exam_id, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('exams').select('id, name').eq('is_active', true).order('created_at', { ascending: true }),
  ])

  const groupList = groups ?? []
  const examName = new Map((exams ?? []).map((e) => [e.id, e.name]))

  // Conteo de miembros por grupo
  const ids = groupList.map((g) => g.id)
  const counts = new Map<string, number>()
  if (ids.length > 0) {
    const { data: members } = await supabase
      .from('group_members')
      .select('group_id')
      .in('group_id', ids)
    for (const m of members ?? []) counts.set(m.group_id, (counts.get(m.group_id) ?? 0) + 1)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis grupos"
        description="Crea grupos, comparte el codigo y sigue el avance de tus alumnos."
        gradient
      />

      <CreateGroupForm exams={exams ?? []} />

      <div className="grid gap-3">
        {groupList.map((g) => (
          <Link key={g.id} href={`/teacher/${g.id}`}>
            <GlassCard variant="elevated" padding="lg" className="flex items-center justify-between gap-4 transition-all hover:border-brand-400/40">
              <div>
                <p className="font-semibold">
                  {g.name}{' '}
                  {g.is_active ? <Badge variant="success">Activo</Badge> : <Badge variant="outline">Inactivo</Badge>}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {examName.get(g.exam_id) ?? 'Examen'} · codigo <span className="font-mono font-semibold text-brand-400">{g.join_code}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" /> {counts.get(g.id) ?? 0}
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </GlassCard>
          </Link>
        ))}

        {groupList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aun no tienes grupos. Crea el primero arriba.</p>
        ) : null}
      </div>
    </div>
  )
}
