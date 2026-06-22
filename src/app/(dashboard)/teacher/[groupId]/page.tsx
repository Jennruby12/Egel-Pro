import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { GlassCard } from '@/components/ui/glass-card'
import { GroupCodeActions } from '@/modules/groups/components/GroupCodeActions'
import { getExamConfig } from '@/lib/exams/exam-config'

export const dynamic = 'force-dynamic'

type Params = { groupId: string }

export default async function TeacherGroupPage({ params }: { params: Promise<Params> }) {
  const { groupId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // El grupo debe ser del maestro (RLS owner). Si no, no aparece.
  const { data: group, error } = await supabase
    .from('groups')
    .select('id, name, join_code, is_active, exam_id, owner_id')
    .eq('id', groupId)
    .single()
  if (error || !group || group.owner_id !== user.id) notFound()

  const examConfig = await getExamConfig(group.exam_id)

  // Miembros del grupo
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id, joined_at')
    .eq('group_id', groupId)

  const memberIds = (members ?? []).map((m) => m.user_id)

  // Perfiles + progreso de los miembros (RLS de maestro lo permite)
  const [{ data: profiles }, { data: progress }] = await Promise.all([
    memberIds.length
      ? supabase.from('profiles').select('id, full_name, email').in('id', memberIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string | null; email: string }[] }),
    memberIds.length
      ? supabase
          .from('user_progress')
          .select('user_id, questions_attempted, questions_correct, last_practiced')
          .eq('exam_id', group.exam_id)
          .in('user_id', memberIds)
      : Promise.resolve({ data: [] as { user_id: string; questions_attempted: number | null; questions_correct: number | null; last_practiced: string | null }[] }),
  ])

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]))
  // Agregar progreso por alumno
  const agg = new Map<string, { attempted: number; correct: number; last: string | null }>()
  for (const p of progress ?? []) {
    const a = agg.get(p.user_id) ?? { attempted: 0, correct: 0, last: null }
    a.attempted += p.questions_attempted ?? 0
    a.correct += p.questions_correct ?? 0
    if (p.last_practiced && (!a.last || p.last_practiced > a.last)) a.last = p.last_practiced
    agg.set(p.user_id, a)
  }

  const rows = (members ?? [])
    .map((m) => {
      const prof = profileById.get(m.user_id)
      const a = agg.get(m.user_id) ?? { attempted: 0, correct: 0, last: null }
      return {
        userId: m.user_id,
        name: prof?.full_name || prof?.email || 'Alumno',
        email: prof?.email ?? '',
        attempted: a.attempted,
        accuracy: a.attempted > 0 ? Math.round((a.correct / a.attempted) * 100) : 0,
        last: a.last,
        joinedAt: m.joined_at,
      }
    })
    .sort((x, y) => y.attempted - x.attempted)

  return (
    <div className="space-y-6">
      <Link href="/teacher" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Mis grupos
      </Link>

      <PageHeader
        title={group.name}
        description={`${examConfig?.name ?? 'Examen'} · comparte el codigo para que tus alumnos entren.`}
      />

      <GlassCard variant="elevated" padding="lg" className="space-y-3">
        <p className="text-sm font-medium">Codigo de acceso</p>
        <GroupCodeActions groupId={group.id} joinCode={group.join_code} isActive={group.is_active} />
        <p className="text-xs text-muted-foreground">
          Los alumnos lo ingresan en su onboarding o en Perfil → Grupos para unirse.
        </p>
      </GlassCard>

      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Users className="h-4 w-4" /> Alumnos ({rows.length})
        </h2>

        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aun no se une nadie. Comparte el codigo.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-bg-border">
            <table className="w-full text-sm">
              <thead className="bg-bg-surface text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Alumno</th>
                  <th className="px-4 py-2">Reactivos</th>
                  <th className="px-4 py-2">Precision</th>
                  <th className="px-4 py-2">Ultima practica</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.userId} className="border-t border-bg-border">
                    <td className="px-4 py-2">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                    </td>
                    <td className="px-4 py-2">{r.attempted}</td>
                    <td className="px-4 py-2">
                      <span className={r.accuracy >= 60 ? 'text-success' : 'text-warning'}>{r.accuracy}%</span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.last ? new Date(r.last).toLocaleDateString('es-MX') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
