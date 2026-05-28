'use client'

import { ArrowRight, Brain, TrendingUp, Trophy } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { SparklesText } from '@/components/ui/sparkles-text'

type Props = {
  fullName: string | null
  onNext: () => void
}

export function WelcomeStep({ fullName, onNext }: Props) {
  const firstName = (fullName ?? '').split(/\s+/)[0] || 'estudiante'
  return (
    <div className="space-y-10 text-center">
      <div className="space-y-4">
        <div className="text-6xl animate-float" aria-hidden>
          👋
        </div>
        <h1 className="text-display-sm tracking-tight md:text-display-md">
          Bienvenido a EGEL
          <span className="text-aurora">Pro</span>,{' '}
          <SparklesText className="text-aurora" count={6}>
            {firstName}
          </SparklesText>
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground">
          Vamos a personalizar tu preparacion para el EGEL Plus ISOFT en 5 pasos
          rapidos. Tomara menos de 2 minutos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Feature
          icon={Brain}
          tint="aurora-1"
          title="Diagnostico"
          description="5 preguntas para saber donde empezas"
        />
        <Feature
          icon={Trophy}
          tint="aurora-2"
          title="Meta"
          description="Define tu nivel objetivo"
        />
        <Feature
          icon={TrendingUp}
          tint="aurora-3"
          title="Plan"
          description="Te armamos un plan adaptado a ti"
        />
      </div>

      <div className="flex justify-center">
        <MagicButton variant="aurora" size="xl" onClick={onNext}>
          Comenzar
          <ArrowRight className="h-5 w-5" />
        </MagicButton>
      </div>
    </div>
  )
}

function Feature({
  icon: Icon,
  title,
  description,
  tint,
}: {
  icon: typeof Brain
  title: string
  description: string
  tint: 'aurora-1' | 'aurora-2' | 'aurora-3'
}) {
  return (
    <GlassCard variant="interactive" padding="md" className="text-left">
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md"
        style={{
          background: `linear-gradient(135deg, hsl(var(--${tint}) / 0.25), hsl(var(--${tint}) / 0.08))`,
          color: `hsl(var(--${tint}))`,
          boxShadow: `0 0 16px -4px hsl(var(--${tint}) / 0.45)`,
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold tracking-tight">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </GlassCard>
  )
}
