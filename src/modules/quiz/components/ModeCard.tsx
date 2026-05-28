'use client'

import type { LucideIcon } from 'lucide-react'
import { Check, Timer, Layers } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils/cn'

type ModeCardProps = {
  id: string
  label: string
  description: string
  questions: string
  time: string
  icon: LucideIcon
  selected: boolean
  disabled?: boolean
  onSelect: (id: string) => void
}

export function ModeCard({
  id,
  label,
  description,
  questions,
  time,
  icon: Icon,
  selected,
  disabled,
  onSelect,
}: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(id)}
      disabled={disabled}
      data-state={selected ? 'selected' : 'idle'}
      data-testid={`mode-card-${id}`}
      className={cn(
        'group relative block w-full text-left transition-transform duration-normal ease-out-expo',
        'hover:scale-[1.015] active:scale-[0.99]',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <GlassCard
        variant="interactive"
        padding="lg"
        className={cn(
          'relative h-full overflow-hidden',
          selected && [
            'border-transparent',
            'shadow-glow-aurora',
            // gradient border via mask
            '[background-image:linear-gradient(hsl(var(--glass-bg)/0.8),hsl(var(--glass-bg)/0.8)),linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)),hsl(var(--aurora-3)))]',
            '[background-origin:border-box]',
            '[background-clip:padding-box,border-box]',
            'border-2',
          ],
        )}
      >
        {/* Check icon flotante cuando esta seleccionado */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)))] text-white shadow-glow-aurora"
            >
              <Check className="h-4 w-4" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4">
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-normal',
              selected
                ? 'bg-[linear-gradient(135deg,hsl(var(--aurora-1)/0.3),hsl(var(--aurora-2)/0.3))] text-aurora-2 ring-1 ring-aurora-2/40'
                : 'bg-brand-400/10 text-brand-400 group-hover:bg-brand-400/15',
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-semibold">{label}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {questions}
            </span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {time}
            </span>
          </div>
        </div>
      </GlassCard>
    </button>
  )
}
