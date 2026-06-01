'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronDown, ChevronUp, Clock, Lightbulb } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { cn } from '@/lib/utils/cn'
import type { Tables } from '@/types/database'

type Guide = Tables<'study_guides'>

type GuideViewerProps = {
  guide: Guide
}

// Mapeo de area -> color visual del chip superior.
const AREA_CHIP: Record<number, string> = {
  1: 'bg-area1/15 text-area1 border-area1/30',
  2: 'bg-area2/15 text-area2 border-area2/30',
  3: 'bg-area3/15 text-area3 border-area3/30',
  4: 'bg-area4/15 text-area4 border-area4/30',
}

export function GuideViewer({ guide }: GuideViewerProps) {
  const [tipsOpen, setTipsOpen] = useState(false)

  const areaChip = AREA_CHIP[guide.area] ?? 'bg-cyan-ice/15 text-cyan-ice border-cyan-ice/30'

  return (
    <GlassCard variant="elevated" padding="xl" className="space-y-6">
      {/* Header con badge area y meta info */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
              areaChip,
            )}
          >
            {guide.section} · Area {guide.area}
          </span>
          <span className="text-muted-foreground/60">·</span>
          <span>Subarea {guide.subarea}</span>
          {guide.reading_time_minutes ? (
            <>
              <span className="text-muted-foreground/60">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {guide.reading_time_minutes} min de lectura
              </span>
            </>
          ) : null}
        </div>
        <h1 className="text-display-sm font-bold tracking-tight md:text-display-md">
          {guide.title}
        </h1>
        {guide.summary ? (
          <p className="text-base text-muted-foreground">{guide.summary}</p>
        ) : null}
      </header>

      {/* Tips CENEVAL - GlassCard interactive con icono especial */}
      {guide.ceneval_tips ? (
        <GlassCard
          variant="interactive"
          padding="md"
          className="border-warning/40 hover:border-warning/70 hover:shadow-[0_0_24px_-4px_hsl(var(--warning)/0.5)]"
          onClick={() => setTipsOpen((v) => !v)}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-warning">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/20 text-warning"
                aria-hidden
              >
                <Lightbulb className="h-4 w-4" />
              </span>
              Tips CENEVAL
            </h2>
            <MagicButton
              variant="ghost"
              size="sm"
              data-testid="toggle-tips"
              onClick={(e) => {
                e.stopPropagation()
                setTipsOpen((v) => !v)
              }}
            >
              {tipsOpen ? (
                <>
                  Ocultar <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Ver tips <ChevronDown className="h-4 w-4" />
                </>
              )}
            </MagicButton>
          </div>
          {tipsOpen ? (
            <div
              className="prose prose-invert prose-sm mt-4 max-w-none border-t border-warning/20 pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.ceneval_tips}</ReactMarkdown>
            </div>
          ) : null}
        </GlassCard>
      ) : null}

      {/* Contenido markdown principal */}
      <div
        className={cn(
          'prose prose-invert max-w-none',
          'prose-headings:font-semibold prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline',
          'prose-pre:bg-bg-raised prose-pre:border prose-pre:border-bg-border prose-pre:rounded-lg',
          'prose-code:text-brand-400 prose-code:before:content-none prose-code:after:content-none',
          'prose-blockquote:border-l-aurora-2 prose-blockquote:bg-bg-raised/40 prose-blockquote:py-2 prose-blockquote:rounded-r-md',
          'prose-strong:text-foreground',
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
      </div>
    </GlassCard>
  )
}
