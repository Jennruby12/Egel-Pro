import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ChevronLeft, Clock, BookOpen, Sparkles } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { GlassCard } from '@/components/ui/glass-card'
import { createClient } from '@/lib/supabase/server'
import { GuideSection } from '@/modules/study/v2/components/GuideSection'
import { ReadingTracker } from '@/modules/study/v2/components/ReadingTracker'
import { ProgressDonut } from '@/modules/study/v2/components/ProgressDonut'
import { findArea } from '@/modules/study/v2/lib/area-slugs'
import { markGuideStarted } from '@/modules/study/v2/actions'

type Params = { areaSlug: string; guideSlug: string }
type Props = { params: Promise<Params> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guideSlug } = await params
  const supabase = await createClient()
  const { data: guide } = await supabase
    .from('guides')
    .select('title, short_description, cover_image_url')
    .eq('slug', guideSlug)
    .single()
  return {
    title: guide?.title ?? 'Guia',
    description: guide?.short_description ?? undefined,
    openGraph: guide?.cover_image_url
      ? { images: [{ url: guide.cover_image_url }] }
      : undefined,
  }
}

export default async function GuidePage({ params }: Props) {
  const { areaSlug, guideSlug } = await params
  const area = findArea(areaSlug)
  if (!area) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: guide } = await supabase
    .from('guides')
    .select('id, slug, title, short_description, weight_in_exam, estimated_minutes, difficulty, cover_image_url, section, area_num, subarea_num')
    .eq('slug', guideSlug)
    .eq('published', true)
    .maybeSingle()

  if (!guide) notFound()
  if (guide.section !== area.section || guide.area_num !== area.area_num) notFound()

  const [sectionsRes, conceptsRes, progressRes] = await Promise.all([
    supabase
      .from('guide_sections')
      .select('id, section_type, order_in_guide, title, body_md, image_url, image_caption, metadata')
      .eq('guide_id', guide.id)
      .order('order_in_guide'),
    supabase
      .from('guide_concepts')
      .select('concept, definition_md, importance')
      .eq('guide_id', guide.id),
    supabase
      .from('user_guide_progress')
      .select('status, percent_read')
      .eq('user_id', user.id)
      .eq('guide_id', guide.id)
      .maybeSingle(),
  ])

  // Marcar guia como iniciada (server-side, fire and forget)
  if (!progressRes.data) {
    void markGuideStarted(guide.id)
  }

  const sections = sectionsRes.data ?? []
  const concepts = (conceptsRes.data ?? []) as Array<{
    concept: string
    definition_md: string | null
    importance: 'alta' | 'media' | 'baja' | null
  }>
  const alreadyCompleted = progressRes.data?.status === 'completado'
  const percent = progressRes.data?.percent_read ?? 0

  return (
    <ReadingTracker guideId={guide.id} alreadyCompleted={alreadyCompleted}>
      <div className="relative">
        <AuroraBackground variant="subtle" className="absolute inset-0 -z-10">
          <div className="h-full w-full" />
        </AuroraBackground>

        <header className="mb-6 space-y-3">
          <Link href={`/study/v2/${area.slug}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-aurora-2">
            <ChevronLeft className="h-3 w-3" />
            {area.name}
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-display-md">
            {guide.title}
          </h1>
          {guide.short_description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">{guide.short_description}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {guide.weight_in_exam ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-aurora-3/30 bg-aurora-3/5 px-2 py-0.5 text-aurora-3">
                <BookOpen className="h-3 w-3" />
                {guide.weight_in_exam} reactivos en el examen
              </span>
            ) : null}
            {guide.estimated_minutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {guide.estimated_minutes} min de lectura
              </span>
            ) : null}
            {guide.difficulty ? (
              <span className="rounded-full border border-bg-border/40 px-2 py-0.5 capitalize">{guide.difficulty}</span>
            ) : null}
            {alreadyCompleted ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-success/50 bg-success/10 px-2 py-0.5 text-success">
                <Sparkles className="h-3 w-3" />
                Completada
              </span>
            ) : null}
          </div>
        </header>

        {!alreadyCompleted && percent > 0 ? (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-aurora-2/30 bg-aurora-2/5 p-3 backdrop-blur-md">
            <ProgressDonut percent={percent} size={48} strokeWidth={5} />
            <div className="flex-1">
              <p className="text-sm font-semibold">Lectura en progreso</p>
              <p className="text-xs text-muted-foreground">Sigue scrolleando para completar la guia y ganar XP</p>
            </div>
          </div>
        ) : null}

        <GlassCard variant="elevated" padding="lg" className="space-y-8">
          {sections.map((s) => (
            <GuideSection
              key={s.id}
              section={{
                id: s.id,
                section_type: s.section_type,
                order_in_guide: s.order_in_guide,
                title: s.title,
                body_md: s.body_md,
                image_url: s.image_url,
                image_caption: s.image_caption,
                metadata: (s.metadata as Record<string, unknown>) ?? null,
              }}
              concepts={concepts}
              guideId={guide.id}
              guideSlug={guide.slug}
            />
          ))}
        </GlassCard>
      </div>
    </ReadingTracker>
  )
}
