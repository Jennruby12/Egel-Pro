import Link from 'next/link'
import { GraduationCap, Plus, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminExamsPage() {
  const supabase = await createClient()
  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examenes"
        description="Cada examen define sus areas, subareas y la distribucion del simulacro."
      />

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/exams/new">
            <Plus className="h-4 w-4" /> Nuevo examen
          </Link>
        </Button>
      </div>

      <div className="grid gap-3">
        {(exams ?? []).map((exam) => (
          <Card key={exam.id} className="border-bg-border bg-bg-surface">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400/10 text-brand-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {exam.name}{' '}
                    {exam.is_active ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="outline">Inactivo</Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {exam.code} · {exam.total_questions} reactivos · {exam.sessions} sesiones
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/exams/${exam.id}`}>
                  <Pencil className="h-4 w-4" /> Editar
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {(exams ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Aun no hay examenes. Crea el primero.</p>
        ) : null}
      </div>
    </div>
  )
}
