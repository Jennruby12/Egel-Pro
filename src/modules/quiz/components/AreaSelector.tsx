'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type AreaOption = {
  area: number
  name: string
  totalQuestions: number
  subareaCount: number
}

type AreaSelectorProps = {
  selected: number[]
  onChange: (areas: number[]) => void
  /** Areas disciplinares del examen activo. */
  areas: AreaOption[]
  availableCounts?: Record<number, number>
}

type AreaStyle = {
  border: string
  bg: string
  text: string
  glow: string
  dot: string
}

const AREA_STYLES: Record<number, AreaStyle> = {
  1: {
    border: 'border-area1/60',
    bg: 'bg-area1/10',
    text: 'text-area1',
    glow: 'shadow-[0_0_24px_-4px_hsl(var(--area-1)/0.6)]',
    dot: 'bg-area1',
  },
  2: {
    border: 'border-area2/60',
    bg: 'bg-area2/10',
    text: 'text-area2',
    glow: 'shadow-[0_0_24px_-4px_hsl(var(--area-2)/0.6)]',
    dot: 'bg-area2',
  },
  3: {
    border: 'border-area3/60',
    bg: 'bg-area3/10',
    text: 'text-area3',
    glow: 'shadow-[0_0_24px_-4px_hsl(var(--area-3)/0.6)]',
    dot: 'bg-area3',
  },
  4: {
    border: 'border-area4/60',
    bg: 'bg-area4/10',
    text: 'text-area4',
    glow: 'shadow-[0_0_24px_-4px_hsl(var(--area-4)/0.6)]',
    dot: 'bg-area4',
  },
}

export function AreaSelector({ selected, onChange, areas, availableCounts }: AreaSelectorProps) {
  function toggle(areaId: number) {
    if (selected.includes(areaId)) {
      onChange(selected.filter((a) => a !== areaId))
    } else {
      onChange([...selected, areaId])
    }
  }

  function selectAll() {
    onChange(areas.map((a) => a.area))
  }

  function clearAll() {
    onChange([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Areas a incluir (vacio = todas)
        </p>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={selectAll}
            className="text-brand-400 transition-colors hover:text-aurora-2"
          >
            Todas
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Ninguna
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {areas.map((area) => {
          const isSelected = selected.includes(area.area)
          const style = AREA_STYLES[area.area] ?? AREA_STYLES[1]!
          return (
            <button
              key={area.area}
              type="button"
              onClick={() => toggle(area.area)}
              className={cn(
                'group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border bg-glass-bg/40 px-4 py-3 text-left text-sm backdrop-blur-md transition-all duration-normal ease-out-expo',
                isSelected
                  ? cn(style.border, style.bg, style.glow)
                  : 'border-glass-border/30 text-muted-foreground hover:border-glass-border/60 hover:text-foreground',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-2.5 w-2.5 shrink-0 rounded-full transition-all',
                    isSelected ? cn(style.dot, 'animate-pulse-glow') : 'bg-bg-border',
                  )}
                />
                <div>
                  <p
                    className={cn(
                      'font-medium leading-tight',
                      isSelected && style.text,
                    )}
                  >
                    Area {area.area}: {area.name}
                  </p>
                  <p className="mt-0.5 text-xs opacity-70">
                    {availableCounts?.[area.area] !== undefined ? (
                      <>
                        <span className="font-semibold">{availableCounts[area.area]}</span> disponibles · {area.totalQuestions} oficiales · {area.subareaCount} subareas
                      </>
                    ) : (
                      <>{area.totalQuestions} reactivos · {area.subareaCount} subareas</>
                    )}
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white',
                      style.dot,
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>
    </div>
  )
}
