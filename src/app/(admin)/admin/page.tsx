import Link from 'next/link'
import { FileQuestion, BookOpen, Users, Upload, Plus, Sparkles, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { AnimatedCounter } from '@/components/ui/animated-counter'

export default async function AdminHomePage() {
  const supabase = await createClient()

  const [
    { count: totalQuestions },
    { count: activeQuestions },
    { count: totalGuides },
    { count: publishedGuides },
    { count: totalUsers },
    { count: totalSessions },
  ] = await Promise.all([
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_deleted', false),
    supabase.from('study_guides').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
    supabase.from('study_guides').select('*', { count: 'exact', head: true }).eq('is_published', true).eq('is_deleted', false),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('quiz_sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
  ])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Panel de administracion"
        description="Gestiona contenido y revisa metricas del simulador EGELPro."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Preguntas" value={totalQuestions ?? 0} sub={`${activeQuestions ?? 0} activas`} icon={<FileQuestion className="h-4 w-4" />} />
        <StatCard label="Guias" value={totalGuides ?? 0} sub={`${publishedGuides ?? 0} publicadas`} icon={<BookOpen className="h-4 w-4" />} />
        <StatCard label="Usuarios" value={totalUsers ?? 0} sub="registrados" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Quizzes completados" value={totalSessions ?? 0} sub="historial total" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Acciones rapidas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard href="/admin/questions/new" icon={Plus} title="Nueva pregunta" description="Crear una pregunta nueva en el banco." />
          <ActionCard href="/admin/questions/import" icon={Upload} title="Importar XLSX" description="Cargar preguntas desde archivo Excel." />
          <ActionCard href="/admin/guides/new" icon={BookOpen} title="Nueva guia" description="Escribir una guia de estudio en Markdown." />
          <ActionCard href="/admin/exams/new" icon={GraduationCap} title="Nuevo examen" description="Crear un EGEL nuevo con sus areas y subareas." />
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, sub, icon }: { label: string; value: number; sub: string; icon: React.ReactNode }) {
  return (
    <Card className="border-bg-border bg-bg-surface transition-colors hover:border-brand-400/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs uppercase tracking-wide">{label}</CardDescription>
          <span className="text-brand-400">{icon}</span>
        </div>
        <CardTitle className="text-3xl font-bold">
          <AnimatedCounter value={value} className="text-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  )
}

function ActionCard({ href, icon: Icon, title, description }: { href: string; icon: typeof FileQuestion; title: string; description: string }) {
  return (
    <Link href={href}>
      <Card className="group h-full border-bg-border bg-bg-surface transition-all hover:-translate-y-0.5 hover:border-brand-400/50 hover:shadow-glow-brand">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-400/10 text-brand-400 transition-colors group-hover:bg-brand-400/20">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
