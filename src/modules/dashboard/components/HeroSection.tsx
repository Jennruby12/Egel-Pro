'use client'

import { CalendarClock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { StreakWidget } from '@/modules/gamification/components/StreakWidget'
import { StreakCountdown } from '@/modules/gamification/components/StreakCountdown'
import { XPBar } from '@/modules/gamification/components/XPBar'
import { LevelBadge } from '@/modules/gamification/components/LevelBadge'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesText } from '@/components/ui/sparkles-text'
import { AnimatedCounter } from '@/components/ui/animated-counter'

type HeroSectionProps = {
  fullName: string | null
  email: string
  xpTotal: number
  level: number
  streakCurrent: number
  streakMax: number
  daysToExam: number | null
  lastActivityDate: string | null
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos dias'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function HeroSection({
  fullName,
  email,
  xpTotal,
  level,
  streakCurrent,
  streakMax,
  daysToExam,
  lastActivityDate,
}: HeroSectionProps) {
  const firstName = (fullName ?? email).split(/\s+/)[0]

  return (
    <section className="relative overflow-hidden rounded-2xl border border-glass-border/40">
      {/* Aurora background corner effect */}
      <AuroraBackground variant="normal" className="absolute inset-0">
        <div className="h-full w-full" />
      </AuroraBackground>

      <div className="relative z-10 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-start justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-aurora-2" />
              <p className="text-sm font-medium text-muted-foreground">
                {getGreeting()}
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-display-md lg:text-display-lg">
              Hola,{' '}
              <SparklesText className="text-aurora">{firstName}</SparklesText>
            </h1>
            {daysToExam !== null ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-glass-border/40 bg-glass-bg/40 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-md">
                <CalendarClock className="h-4 w-4 text-cyan-ice" />
                {daysToExam > 0 ? (
                  <>
                    Tu examen es en{' '}
                    <span className="font-semibold text-foreground">
                      <AnimatedCounter value={daysToExam} />
                    </span>{' '}
                    {daysToExam === 1 ? 'dia' : 'dias'}
                  </>
                ) : daysToExam === 0 ? (
                  <span className="font-semibold text-aurora-3">
                    Tu examen es hoy! Mucho exito.
                  </span>
                ) : (
                  'Tu fecha de examen ya paso. Actualizala en tu perfil.'
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Agrega tu fecha de examen en tu perfil para ver una cuenta regresiva.
              </p>
            )}
          </div>

          <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:items-end sm:gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <StreakWidget current={streakCurrent} max={streakMax} size="lg" />
              <LevelBadge level={level} size="lg" />
            </div>
            <div className="hidden sm:block">
              <StreakCountdown
                lastActivityDate={lastActivityDate}
                currentStreak={streakCurrent}
                variant="inline"
              />
            </div>
          </div>
        </motion.div>

        {/* Countdown completo en mobile (full row debajo del greeting) */}
        <div className="mt-4 sm:hidden">
          <StreakCountdown
            lastActivityDate={lastActivityDate}
            currentStreak={streakCurrent}
            variant="card"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl"
        >
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="font-semibold text-foreground">Tu progreso XP</span>
            <span className="font-mono text-xp">
              <AnimatedCounter value={xpTotal} suffix=" XP" />
            </span>
          </div>
          <XPBar xpTotal={xpTotal} showLabels />
        </motion.div>
      </div>
    </section>
  )
}
