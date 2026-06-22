import Link from 'next/link'
import { Building2, Plus, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminOrgsPage() {
  const supabase = await createClient()
  const { data: orgs } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <PageHeader title="Organizaciones" description="Universidades / instituciones (tenants) y sus coordinadores." />

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/orgs/new"><Plus className="h-4 w-4" /> Nueva organizacion</Link>
        </Button>
      </div>

      <div className="grid gap-3">
        {(orgs ?? []).map((o) => (
          <Card key={o.id} className="border-bg-border bg-bg-surface">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400/10 text-brand-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {o.name}{' '}
                    {o.is_active ? <Badge variant="success">Activa</Badge> : <Badge variant="outline">Inactiva</Badge>}
                  </p>
                  <p className="text-xs text-muted-foreground">{o.slug} · plan {o.plan ?? 'free'}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/orgs/${o.id}`}><Pencil className="h-4 w-4" /> Gestionar</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {(orgs ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Aun no hay organizaciones.</p>
        ) : null}
      </div>
    </div>
  )
}
