'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { getPerformanceLevel } from '@/lib/constants/egel'
import { cn } from '@/lib/utils/cn'

type PredictionCardProps = {
  /** 0-100 */
  overallAccuracy: number
  totalAttempted: number
}

const LEVEL_LABEL: Record<string, string> = {
  ans: 'Aun no satisfactorio',
  satisfactorio: 'Satisfactorio',
  sobresaliente: 'Sobresaliente',
}

const LEVEL_VARIANT: Record<string, 'destructive' | 'warning' | 'success'> = {
  ans: 'destructive',
  satisfactorio: 'warning',
  sobresaliente: 'success',
}

function getConfidence(attempted: number): { label: string; tone: string; helper: string } {
  if (attempted < 50) {
    return {
      label: 'Baja',
      tone: 'text-warning',
      helper: 'Responde mas preguntas para una estimacion confiable.',
    }
  }
  if (attempted < 200) {
    return {
      label: 'Media',
      tone: 'text-brand-400',
      helper: 'Sigue practicando para refinar la prediccion.',
    }
  }
  return {
    label: 'Alta',
    tone: 'text-success',
    helper: 'Tu prediccion tiene una base solida de datos.',
  }
}

export function PredictionCard({ overallAccuracy, totalAttempted }: PredictionCardProps) {
  const level = getPerformanceLevel(overallAccuracy)
  const confidence = getConfidence(totalAttempted)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Nivel estimado en el examen</h3>
        <p className="text-xs text-muted-foreground">Basado en tu precision actual</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-display-md font-bold tabular-nums text-aurora">
            <AnimatedCounter value={overallAccuracy} suffix="%" />
          </p>
          <p className="text-xs text-muted-foreground">
            {totalAttempted}{' '}
            {totalAttempted === 1 ? 'pregunta respondida' : 'preguntas respondidas'}
          </p>
        </div>
        <Badge variant={LEVEL_VARIANT[level]} className="text-sm">
          {LEVEL_LABEL[level]}
        </Badge>
      </div>

      {/* Barra de niveles con marker glow */}
      <div className="space-y-2">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-raised">
          <div className="absolute inset-y-0 left-0 w-[60%] bg-danger/25" />
          <div className="absolute inset-y-0 left-[60%] w-[20%] bg-warning/30" />
          <div className="absolute inset-y-0 left-[80%] w-[20%] bg-success/35" />
          <motion.div
            className="absolute top-1/2 z-10 h-5 w-1.5 -translate-y-1/2 rounded-sm bg-foreground shadow-[0_0_12px_2px_hsl(var(--brand-400)/0.8)]"
            initial={{ left: '0%' }}
            animate={{ left: `${Math.max(0, Math.min(100, overallAccuracy))}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>0%</span>
          <span>60%</span>
          <span>80%</span>
          <span>100%</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>ANS</span>
          <span className="ml-auto mr-auto pl-6">Satisfactorio</span>
          <span>Sobresaliente</span>
        </div>
      </div>

      <div className="space-y-1 rounded-md border border-bg-border/60 bg-bg-base/50 px-3 py-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Confianza de la prediccion</span>
          <span className={cn('font-semibold', confidence.tone)}>{confidence.label}</span>
        </div>
        <p className="text-muted-foreground">{confidence.helper}</p>
      </div>

      {totalAttempted < 50 ? (
        <p className="text-xs text-muted-foreground">
          Recomendado: responde al menos 50 preguntas para mejorar la estimacion.
        </p>
      ) : null}
    </div>
  )
}
