'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Check, Loader2, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { SparklesText } from '@/components/ui/sparkles-text'
import { fireConfetti } from '@/components/ui/confetti'
import { completeOnboarding } from '@/modules/onboarding/actions'
import { getPerformanceLevel } from '@/lib/constants/egel'
import type { CompleteOnboardingInput } from '@/lib/validations/onboarding.schema'

type Props = {
  examDate: string
  university: string
  goal: 'satisfactorio' | 'sobresaliente'
  diagnosticScore: CompleteOnboardingInput['diagnostic_score']
  onBack: () => void
}

export function SummaryStep({
  examDate,
  university,
  goal,
  diagnosticScore,
  onBack,
}: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const performance = getPerformanceLevel(diagnosticScore.percent)

  const perfTint =
    performance === 'sobresaliente'
      ? 'success'
      : performance === 'satisfactorio'
        ? 'warning'
        : 'danger'

  const perfLabel =
    performance === 'sobresaliente'
      ? 'Sobresaliente'
      : performance === 'satisfactorio'
        ? 'Satisfactorio'
        : 'ANS'

  function handleConfirm() {
    startTransition(async () => {
      const result = await completeOnboarding({
        exam_date: examDate || '',
        university: university || '',
        goal_level: goal,
        diagnostic_score: diagnosticScore,
      })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      fireConfetti('celebration')
      toast.success('Listo! Bienvenido a EGELPro')
      router.push('/dashboard')
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <div className="text-5xl animate-float" aria-hidden>
          🎯
        </div>
        <h2 className="text-display-sm tracking-tight">
          Tu plan esta{' '}
          <SparklesText className="text-aurora" count={6}>
            listo
          </SparklesText>
        </h2>
        <p className="text-sm text-muted-foreground">
          Asi se ve tu punto de partida hoy.
        </p>
      </div>

      {/* Stats grandes */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard variant="elevated" padding="md" className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Nivel actual
          </p>
          <p
            className="mt-2 text-display-sm font-bold tabular-nums"
            style={{ color: `hsl(var(--${perfTint}))` }}
          >
            <AnimatedCounter value={diagnosticScore.percent} decimals={0} suffix="%" />
          </p>
          <p
            className="mt-1 text-xs font-semibold uppercase tracking-wider"
            style={{ color: `hsl(var(--${perfTint}))` }}
          >
            {perfLabel}
          </p>
        </GlassCard>

        <GlassCard variant="elevated" padding="md" className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Correctas
          </p>
          <p className="mt-2 text-display-sm font-bold tabular-nums text-aurora">
            <AnimatedCounter value={diagnosticScore.correct} />
            <span className="text-muted-foreground/60">
              /{diagnosticScore.total}
            </span>
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Diagnostico
          </p>
        </GlassCard>
      </div>

      {/* Detalles plan */}
      <GlassCard variant="flat" padding="lg" className="space-y-3">
        <Row label="Fecha de examen" value={examDate || 'Sin definir'} />
        {university ? <Row label="Universidad" value={university} /> : null}
        <Row
          label="Meta"
          value={
            goal === 'sobresaliente'
              ? 'Sobresaliente (>= 80%)'
              : 'Satisfactorio (>= 60%)'
          }
        />
      </GlassCard>

      {/* Tip */}
      <div
        className="flex gap-3 rounded-lg border p-4 text-sm"
        style={{
          borderColor: 'hsl(var(--aurora-2) / 0.3)',
          background:
            'linear-gradient(135deg, hsl(var(--aurora-1) / 0.06), hsl(var(--aurora-2) / 0.04))',
        }}
      >
        <Sparkles className="h-5 w-5 shrink-0 text-aurora-2" />
        <p className="text-muted-foreground">
          Comienza practicando las areas mas debiles. Te recomendamos hacer al
          menos <span className="font-semibold text-foreground">1 quiz al dia</span>{' '}
          para mantener tu racha activa.
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <MagicButton variant="ghost" size="md" onClick={onBack} disabled={pending}>
          <ArrowLeft className="h-4 w-4" />
          Atras
        </MagicButton>
        <MagicButton
          variant="aurora"
          size="lg"
          onClick={handleConfirm}
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Empezar a practicar
        </MagicButton>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
