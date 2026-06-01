import Link from 'next/link'
import { Clock, BookOpen, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Props = {
  areaSlug: string
  guide: {
    slug: string
    title: string
    short_description: string | null
    weight_in_exam: number | null
    estimated_minutes: number | null
    difficulty: string | null
    cover_image_url: string | null
  }
  /** Estado de progreso del usuario en esta guia. */
  progress?: {
    status: 'no_iniciado' | 'en_progreso' | 'completado'
    percent_read: number
  }
}

export function GuideCard({ areaSlug, guide, progress }: Props) {
  const status = progress?.status ?? 'no_iniciado'
  const pct = progress?.percent_read ?? 0
  return (
    <Link
      href={`/study/v2/${areaSlug}/${guide.slug}`}
      className={cn(
        'group flex flex-col gap-3 rounded-2xl border bg-glass-bg/40 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5',
        status === 'completado'
          ? 'border-success/40 hover:border-success/60'
          : 'border-glass-border/40 hover:border-aurora-2/40',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold leading-tight">{guide.title}</h3>
        {status === 'completado' ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        ) : status === 'en_progreso' ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aurora-2/20 text-aurora-2">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>

      {guide.short_description ? (
        <p className="text-xs text-muted-foreground line-clamp-3">{guide.short_description}</p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {guide.weight_in_exam ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-aurora-3/30 bg-aurora-3/5 px-2 py-0.5 text-aurora-3">
            <BookOpen className="h-3 w-3" />
            {guide.weight_in_exam} reactivos
          </span>
        ) : null}
        {guide.estimated_minutes ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {guide.estimated_minutes} min
          </span>
        ) : null}
        {guide.difficulty ? (
          <span className="rounded-full border border-bg-border/40 px-2 py-0.5 capitalize">
            {guide.difficulty}
          </span>
        ) : null}
      </div>

      {status === 'en_progreso' ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-raised/60">
          <div
            className="h-full bg-gradient-to-r from-aurora-1 via-aurora-2 to-aurora-3 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </Link>
  )
}
