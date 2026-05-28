'use client'

import { ArrowLeft, ArrowRight, Target, Trophy } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { cn } from '@/lib/utils/cn'

type Goal = 'satisfactorio' | 'sobresaliente'

type Props = {
  goal: Goal
  onChange: (goal: Goal) => void
  onBack: () => void
  onNext: () => void
}

const OPTIONS: Array<{
  id: Goal
  label: string
  description: string
  threshold: string
  icon: typeof Trophy
  tint: 'warning' | 'aurora-2'
  selectedShadow: string
  selectedBorder: string
  selectedBg: string
}> = [
  {
    id: 'satisfactorio',
    label: 'Satisfactorio',
    description: 'Aprobar el examen con buen nivel.',
    threshold: '>= 60%',
    icon: Target,
    tint: 'warning',
    selectedShadow: '0 0 32px -8px hsl(var(--warning) / 0.5)',
    selectedBorder: 'hsl(var(--warning))',
    selectedBg: 'hsl(var(--warning) / 0.08)',
  },
  {
    id: 'sobresaliente',
    label: 'Sobresaliente',
    description: 'Dar lo mejor de ti y destacar.',
    threshold: '>= 80%',
    icon: Trophy,
    tint: 'aurora-2',
    selectedShadow: '0 0 32px -8px hsl(var(--aurora-2) / 0.6)',
    selectedBorder: 'hsl(var(--aurora-2))',
    selectedBg: 'hsl(var(--aurora-2) / 0.1)',
  },
]

export function GoalStep({ goal, onChange, onBack, onNext }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <div
          className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xp"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--xp) / 0.25), hsl(var(--aurora-3) / 0.1))',
            boxShadow: '0 0 24px -8px hsl(var(--xp) / 0.5)',
          }}
        >
          <Trophy className="h-6 w-6" />
        </div>
        <h2 className="text-display-sm tracking-tight">
          Cual es tu <span className="text-aurora">meta</span>?
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Tu meta nos ayuda a calibrar la dificultad de tus quizzes diarios.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon
          const selected = goal === opt.id
          return (
            <GlassCard
              key={opt.id}
              variant={selected ? 'elevated' : 'interactive'}
              padding="lg"
              className={cn(
                'cursor-pointer space-y-4 transition-all duration-normal',
                selected && 'scale-[1.02]',
              )}
              style={
                selected
                  ? {
                      borderColor: opt.selectedBorder,
                      backgroundColor: opt.selectedBg,
                      boxShadow: opt.selectedShadow,
                    }
                  : undefined
              }
              onClick={() => onChange(opt.id)}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background: `hsl(var(--${opt.tint}) / 0.15)`,
                    color: `hsl(var(--${opt.tint}))`,
                    boxShadow: `0 0 16px -4px hsl(var(--${opt.tint}) / 0.4)`,
                  }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                {selected ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)))] text-white shadow-glow-brand">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : null}
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {opt.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {opt.description}
                </p>
              </div>
              <p
                className="font-mono text-xs font-semibold"
                style={{ color: `hsl(var(--${opt.tint}))` }}
              >
                {opt.threshold}
              </p>
            </GlassCard>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <MagicButton variant="ghost" size="md" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Atras
        </MagicButton>
        <MagicButton variant="aurora" size="md" onClick={onNext}>
          Continuar
          <ArrowRight className="h-4 w-4" />
        </MagicButton>
      </div>
    </div>
  )
}
