import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { deleteGuide, togglePublishGuide } from '@/modules/study/actions'

export default async function AdminGuidesPage() {
  const supabase = await createClient()

  // Mostramos TODAS las guias no eliminadas (incluye borradores).
  const { data: guides } = await supabase
    .from('study_guides')
    .select('*')
    .eq('is_deleted', false)
    .order('section', { ascending: true })
    .order('area', { ascending: true })
    .order('subarea', { ascending: true })
    .order('updated_at', { ascending: false })
    .limit(500)

  const rows = guides ?? []

  return (
    <div>
      <PageHeader
        title="Guias de estudio"
        description="Gestiona el contenido de estudio que veran los estudiantes."
        actions={
          <Button asChild>
            <Link href="/admin/guides/new">
              <Plus className="h-4 w-4" />
              Nueva guia
            </Link>
          </Button>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Aun no hay guias creadas. Empieza con la primera.
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/guides/new">
                <Plus className="h-4 w-4" />
                Crear guia
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-bg-border bg-bg-raised text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Titulo</th>
                  <th className="px-4 py-3 font-medium">Area / Subarea</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Lectura</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-bg-border last:border-0 hover:bg-bg-raised/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{g.title}</div>
                      <div className="mt-0.5 text-xs capitalize text-muted-foreground">
                        {g.section}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Area {g.area} • Subarea {g.subarea}
                    </td>
                    <td className="px-4 py-3">
                      {g.is_published ? (
                        <Badge variant="success">Publicada</Badge>
                      ) : (
                        <Badge variant="outline">Borrador</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {g.reading_time_minutes ? `${g.reading_time_minutes} min` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/guides/${g.id}`}>Editar</Link>
                        </Button>

                        <form
                          action={async () => {
                            'use server'
                            await togglePublishGuide({
                              id: g.id,
                              isPublished: !(g.is_published ?? false),
                            })
                          }}
                        >
                          <Button type="submit" variant="ghost" size="sm">
                            {g.is_published ? 'Despublicar' : 'Publicar'}
                          </Button>
                        </form>

                        <form
                          action={async () => {
                            'use server'
                            await deleteGuide({ id: g.id })
                          }}
                        >
                          <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                            Eliminar
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
