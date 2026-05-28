'use client'

import { Brain, Timer, Trophy, RotateCcw, Zap, Calendar } from 'lucide-react'
import { ModeCard } from './ModeCard'
import type { QuizMode } from '@/types/global'

type ModeDef = {
  id: QuizMode
  label: string
  description: string
  questions: string
  time: string
  icon: typeof Brain
  defaults: { total: number; timeLimitSeconds: number | null }
}

export const QUIZ_MODES: ModeDef[] = [
  {
    id: 'practice',
    label: 'Practica',
    description: 'Modo libre sin presion de tiempo. Ideal para aprender.',
    questions: '10-30 preg',
    time: 'Sin limite',
    icon: Brain,
    defaults: { total: 20, timeLimitSeconds: null },
  },
  {
    id: 'quick_exam',
    label: 'Examen rapido',
    description: 'Mini examen cronometrado para evaluar tu nivel.',
    questions: '20 preg',
    time: '15 min',
    icon: Timer,
    defaults: { total: 20, timeLimitSeconds: 900 },
  },
  {
    id: 'full_simulacro',
    label: 'Simulacro completo',
    description: 'Reproduce el EGEL real. 2 sesiones x 4.5h.',
    questions: '203 preg',
    time: '4.5h x 2',
    icon: Trophy,
    defaults: { total: 102, timeLimitSeconds: 16_200 },
  },
  {
    id: 'review',
    label: 'Repasar errores',
    description: 'Solo las preguntas que has fallado antes.',
    questions: '10-20 preg',
    time: 'Sin limite',
    icon: RotateCcw,
    defaults: { total: 15, timeLimitSeconds: null },
  },
  {
    id: 'speed_challenge',
    label: 'Reto rapido',
    description: 'Responde lo mas rapido posible. Pocas pero veloces.',
    questions: '10 preg',
    time: '3 min',
    icon: Zap,
    defaults: { total: 10, timeLimitSeconds: 180 },
  },
  {
    id: 'daily_challenge',
    label: 'Reto diario',
    description: 'Set seleccionado del dia. Bonus de XP al completar.',
    questions: '5 preg',
    time: '5 min',
    icon: Calendar,
    defaults: { total: 5, timeLimitSeconds: 300 },
  },
]

type ModeSelectorProps = {
  selected: QuizMode | null
  onSelect: (mode: QuizMode) => void
}

export function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {QUIZ_MODES.map((m) => (
        <ModeCard
          key={m.id}
          id={m.id}
          label={m.label}
          description={m.description}
          questions={m.questions}
          time={m.time}
          icon={m.icon}
          selected={selected === m.id}
          onSelect={(id) => onSelect(id as QuizMode)}
        />
      ))}
    </div>
  )
}
