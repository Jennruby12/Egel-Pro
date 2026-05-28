'use client'

import Link from 'next/link'
import { BookOpen, ChevronRight, Layers, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Badge } from '@/components/ui/badge'
import { DISCIPLINAR_AREAS, TRANSVERSAL_AREAS } from '@/lib/constants/egel'
import { cn } from '@/lib/utils/cn'
import type { Tables } from '@/types/database'

type Guide = Tables<'study_guides'>

type StudyHubProps = {
  guides: Guide[]
}

// Mapeo visual por area para usar en bordes, glow, y backgrounds aurora.
const AREA_STYLES: Record<
  number,
  { text: string; border: string; ring: string; glow: string; bg: string; chip: string }
> = {
  1: {
    text: 'text-area1',
    border: 'border-area1/40',
    ring: 'hover:border-area1/70',
    glow: 'hover:shadow-[0_0_32px_-4px_hsl(var(--area-1)/0.55)]',
    bg: 'bg-area1/10',
    chip: 'bg-area1/15 text-area1 border-area1/30',
  },
  2: {
    text: 'text-area2',
    border: 'border-area2/40',
    ring: 'hover:border-area2/70',
    glow: 'hover:shadow-[0_0_32px_-4px_hsl(var(--area-2)/0.55)]',
    bg: 'bg-area2/10',
    chip: 'bg-area2/15 text-area2 border-area2/30',
  },
  3: {
    text: 'text-area3',
    border: 'border-area3/40',
    ring: 'hover:border-area3/70',
    glow: 'hover:shadow-[0_0_32px_-4px_hsl(var(--area-3)/0.55)]',
    bg: 'bg-area3/10',
    chip: 'bg-area3/15 text-area3 border-area3/30',
  },
  4: {
    text: 'text-area4',
    border: 'border-area4/40',
    ring: 'hover:border-area4/70',
    glow: 'hover:shadow-[0_0_32px_-4px_hsl(var(--area-4)/0.55)]',
    bg: 'bg-area4/10',
    chip: 'bg-area4/15 text-area4 border-area4/30',
  },
}

const TRANSVERSAL_STYLE = {
  text: 'text-cyan-ice',
  border: 'border-cyan-ice/40',
  ring: 'hover:border-cyan-ice/70',
  glow: 'hover:shadow-[0_0_32px_-4px_hsl(var(--cyan-ice)/0.55)]',
  bg: 'bg-cyan-ice/10',
  chip: 'bg-cyan-ice/15 text-cyan-ice border-cyan-ice/30',
}

export function StudyHub({ guides }: StudyHubProps) {
  const guidesBySubarea = new Map<string, number>()
  for (const g of guides) {
    const key = `${g.section}-${g.area}-${g.subarea}`
    guidesBySubarea.set(key, (guidesBySubarea.get(key) ?? 0) + 1)
  }

  const totalSubareas =
    DISCIPLINAR_AREAS.reduce((sum, a) => sum + a.subareas.length, 0) +
    TRANSVERSAL_AREAS.reduce((sum, a) => sum + a.subareas.length, 0)

  const publishedCount = guides.length
  const subareasConContenido = guidesBySubarea.size
  const coveragePercent =
    totalSubareas === 0 ? 0 : Math.round((subareasConContenido / totalSubareas) * 100)

  return (
    <div className="space-y-10">
      {/* Resumen general con AnimatedCounter y barra aurora */}
      <GlassCard variant="elevated" padding="lg" className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Cobertura del temario
            </p>
            <p className="text-3xl font-bold">
              <AnimatedCounter value={subareasConContenido} />
              <span className="text-muted-foreground"> / {totalSubareas} subareas</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              <AnimatedCounter value={publishedCount} suffix={publishedCount === 1 ? ' guia' : ' guias'} />
            </Badge>
          </div>
        </div>
        {/* Barra aurora gradient */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-bg-raised">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${coveragePercent}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--aurora-1)),hsl(var(--aurora-2))_50%,hsl(var(--aurora-3)))]"
          />
        </div>
      </GlassCard>

      {/* Areas disciplinares — Bento Grid 4 cards */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Areas disciplinares</h2>
          <p className="text-sm text-muted-foreground">
            Contenido especifico de Ingenieria de Software (143 reactivos en el examen).
          </p>
        </div>

        <BentoGrid className="lg:grid-cols-2">
          {DISCIPLINAR_AREAS.map((area, idx) => {
            const styles = AREA_STYLES[area.area] ?? AREA_STYLES[1]
            const subareasCovered = area.subareas.filter(
              (sub) => (guidesBySubarea.get(`disciplinar-${area.area}-${sub.subarea}`) ?? 0) > 0,
            ).length
            const totalGuidesArea = area.subareas.reduce(
              (acc, sub) =>
                acc + (guidesBySubarea.get(`disciplinar-${area.area}-${sub.subarea}`) ?? 0),
              0,
            )

            return (
              <motion.div
                key={`disc-${area.area}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3"
              >
                <GlassCard
                  variant="interactive"
                  padding="lg"
                  className={cn(
                    'group relative h-full border transition-all duration-normal',
                    styles.border,
                    styles.ring,
                    styles.glow,
                  )}
                  data-testid={`study-area-${area.area}`}
                >
                  {/* Aura de color del area en la esquina */}
                  <div
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-40 transition-opacity duration-normal group-hover:opacity-70',
                      styles.bg,
                    )}
                  />
                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
                            styles.chip,
                          )}
                        >
                          <BookOpen className="h-3 w-3" />
                          Area {area.area}
                        </span>
                        <h3 className={cn('mt-3 text-xl font-bold', styles.text)}>{area.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {area.totalQuestions} reactivos · {area.subareas.length} subareas
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold tabular-nums">
                          <AnimatedCounter value={totalGuidesArea} />
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          guias
                        </p>
                      </div>
                    </div>

                    {/* Mini barra de cobertura del area */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Cobertura</span>
                        <span>
                          {subareasCovered} / {area.subareas.length}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
                        <div
                          className={cn('h-full rounded-full transition-all', styles.bg)}
                          style={{
                            width: `${(subareasCovered / area.subareas.length) * 100}%`,
                            backgroundColor: `hsl(var(--area-${area.area}))`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Lista compacta de subareas */}
                    <div className="space-y-1">
                      {area.subareas.map((sub) => {
                        const count =
                          guidesBySubarea.get(`disciplinar-${area.area}-${sub.subarea}`) ?? 0
                        const hasContent = count > 0
                        return (
                          <Link
                            key={`disc-${area.area}-${sub.subarea}`}
                            href={`/study/${area.area}/${sub.subarea}?section=disciplinar`}
                            className={cn(
                              'flex items-center justify-between gap-2 rounded-md border border-transparent px-2.5 py-1.5 text-xs transition-all',
                              'hover:border-bg-border hover:bg-bg-raised/60',
                              !hasContent && 'opacity-50',
                            )}
                            data-testid={`study-subarea-${area.area}-${sub.subarea}`}
                          >
                            <span className="line-clamp-1 flex-1">{sub.name}</span>
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums',
                                hasContent ? styles.chip : 'bg-bg-raised text-muted-foreground',
                              )}
                            >
                              {count}
                            </span>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/study/${area.area}/${area.subareas[0]?.subarea ?? 1}?section=disciplinar`}
                      >
                        <MagicButton variant="ghost" size="sm" className="w-full justify-between">
                          Entrar al area
                          <ChevronRight className="h-4 w-4" />
                        </MagicButton>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </BentoGrid>
      </section>

      {/* Areas transversales — 1 fila, 2 cards lado a lado */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Areas transversales</h2>
          <p className="text-sm text-muted-foreground">
            Comprension lectora y redaccion (60 reactivos en el examen).
          </p>
        </div>

        <BentoGrid className="lg:grid-cols-2">
          {TRANSVERSAL_AREAS.map((area, idx) => {
            const totalGuidesArea = area.subareas.reduce(
              (acc, sub) =>
                acc + (guidesBySubarea.get(`transversal-${area.area}-${sub.subarea}`) ?? 0),
              0,
            )
            return (
              <motion.div
                key={`trans-${area.area}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3"
              >
                <GlassCard
                  variant="interactive"
                  padding="lg"
                  className={cn(
                    'group relative h-full border transition-all duration-normal',
                    TRANSVERSAL_STYLE.border,
                    TRANSVERSAL_STYLE.ring,
                    TRANSVERSAL_STYLE.glow,
                  )}
                >
                  <div
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-40 transition-opacity duration-normal group-hover:opacity-70',
                      TRANSVERSAL_STYLE.bg,
                    )}
                  />
                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
                            TRANSVERSAL_STYLE.chip,
                          )}
                        >
                          <Layers className="h-3 w-3" />
                          Transversal {area.area}
                        </span>
                        <h3 className={cn('mt-3 text-xl font-bold', TRANSVERSAL_STYLE.text)}>
                          {area.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {area.totalQuestions} reactivos · {area.subareas.length} subareas
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold tabular-nums">
                          <AnimatedCounter value={totalGuidesArea} />
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          guias
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {area.subareas.map((sub) => {
                        const count =
                          guidesBySubarea.get(`transversal-${area.area}-${sub.subarea}`) ?? 0
                        const hasContent = count > 0
                        return (
                          <Link
                            key={`trans-${area.area}-${sub.subarea}`}
                            href={`/study/${area.area}/${sub.subarea}?section=transversal`}
                            className={cn(
                              'flex items-center justify-between gap-2 rounded-md border border-transparent px-2.5 py-1.5 text-xs transition-all',
                              'hover:border-bg-border hover:bg-bg-raised/60',
                              !hasContent && 'opacity-50',
                            )}
                          >
                            <span className="line-clamp-1 flex-1">{sub.name}</span>
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums',
                                hasContent
                                  ? TRANSVERSAL_STYLE.chip
                                  : 'bg-bg-raised text-muted-foreground',
                              )}
                            >
                              {count}
                            </span>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/study/${area.area}/${area.subareas[0]?.subarea ?? 1}?section=transversal`}
                      >
                        <MagicButton variant="ghost" size="sm" className="w-full justify-between">
                          Entrar al area
                          <ChevronRight className="h-4 w-4" />
                        </MagicButton>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </BentoGrid>
      </section>
    </div>
  )
}
