'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  examDate: string
  university: string
  onChange: (data: { examDate: string; university: string }) => void
  onBack: () => void
  onNext: () => void
}

function daysFromToday(dateISO: string): number | null {
  if (!dateISO) return null
  const target = new Date(dateISO + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )
  return diff
}

export function ExamDateStep({
  examDate,
  university,
  onChange,
  onBack,
  onNext,
}: Props) {
  const days = daysFromToday(examDate)
  const minDate = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <div
          className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl text-aurora-2"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--aurora-2) / 0.25), hsl(var(--aurora-1) / 0.1))',
            boxShadow: '0 0 24px -8px hsl(var(--aurora-2) / 0.5)',
          }}
        >
          <Calendar className="h-6 w-6" />
        </div>
        <h2 className="text-display-sm tracking-tight">
          Cuando es tu <span className="text-aurora">examen</span>?
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Usamos esta fecha para armar tu plan diario. Puedes cambiarla cuando
          quieras desde tu perfil.
        </p>
      </div>

      <GlassCard variant="elevated" padding="lg" className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="exam_date">Fecha del examen (opcional)</Label>
          <Input
            id="exam_date"
            type="date"
            min={minDate}
            value={examDate}
            onChange={(e) =>
              onChange({ examDate: e.target.value, university })
            }
          />
          {days !== null && days >= 0 ? (
            <motion.div
              key={days}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--aurora-2) / 0.2), hsl(var(--aurora-3) / 0.1))',
                color: 'hsl(var(--aurora-2))',
                boxShadow: '0 0 16px -4px hsl(var(--aurora-2) / 0.4)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Faltan {days} dia{days === 1 ? '' : 's'} para tu examen
            </motion.div>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">Universidad (opcional)</Label>
          <Input
            id="university"
            placeholder="UNAM, IPN, ITESM..."
            value={university}
            onChange={(e) =>
              onChange({ examDate, university: e.target.value })
            }
          />
        </div>
      </GlassCard>

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
