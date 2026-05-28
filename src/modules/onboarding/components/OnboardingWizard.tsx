'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { WelcomeStep } from './WelcomeStep'
import { ExamDateStep } from './ExamDateStep'
import {
  DiagnosticStep,
  type DiagnosticQuestion,
  type AnswerMap,
} from './DiagnosticStep'
import { GoalStep } from './GoalStep'
import { SummaryStep } from './SummaryStep'

type WizardProps = {
  fullName: string | null
  questions: DiagnosticQuestion[]
}

type Step = 'welcome' | 'exam-date' | 'diagnostic' | 'goal' | 'summary'

const STEPS_ORDER: Step[] = [
  'welcome',
  'exam-date',
  'diagnostic',
  'goal',
  'summary',
]

const STEP_LABELS: Record<Step, string> = {
  welcome: 'Bienvenido',
  'exam-date': 'Examen',
  diagnostic: 'Diagnostico',
  goal: 'Meta',
  summary: 'Resumen',
}

export function OnboardingWizard({ fullName, questions }: WizardProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [examDate, setExamDate] = useState('')
  const [university, setUniversity] = useState('')
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [goal, setGoal] = useState<'satisfactorio' | 'sobresaliente'>(
    'sobresaliente',
  )

  function go(next: Step) {
    setStep(next)
  }

  // Compute diagnostic score
  const correct = questions.filter(
    (q) => answers[q.id] === q.correct_answer,
  ).length
  const total = questions.length
  const percent = total > 0 ? Math.round((correct / total) * 10_000) / 100 : 0

  const byAreaRaw = new Map<number, { c: number; t: number }>()
  for (const q of questions) {
    const b = byAreaRaw.get(q.area) ?? { c: 0, t: 0 }
    b.t++
    if (answers[q.id] === q.correct_answer) b.c++
    byAreaRaw.set(q.area, b)
  }
  const byArea: Record<string, number> = {}
  for (const [area, b] of Array.from(byAreaRaw.entries())) {
    byArea[`area${area}`] = b.t > 0 ? Math.round((b.c / b.t) * 100) : 0
  }

  const diagnosticScore = { correct, total, percent, byArea }

  return (
    <div className="space-y-8">
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 'welcome' && (
            <WelcomeStep
              fullName={fullName}
              onNext={() => go('exam-date')}
            />
          )}

          {step === 'exam-date' && (
            <ExamDateStep
              examDate={examDate}
              university={university}
              onChange={({ examDate: e, university: u }) => {
                setExamDate(e)
                setUniversity(u)
              }}
              onBack={() => go('welcome')}
              onNext={() => go('diagnostic')}
            />
          )}

          {step === 'diagnostic' && (
            <DiagnosticStep
              questions={questions}
              answers={answers}
              onAnswersChange={setAnswers}
              onBack={() => go('exam-date')}
              onNext={() => go('goal')}
            />
          )}

          {step === 'goal' && (
            <GoalStep
              goal={goal}
              onChange={setGoal}
              onBack={() => go('diagnostic')}
              onNext={() => go('summary')}
            />
          )}

          {step === 'summary' && (
            <SummaryStep
              examDate={examDate}
              university={university}
              goal={goal}
              diagnosticScore={diagnosticScore}
              onBack={() => go('goal')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function StepIndicator({ current }: { current: Step }) {
  const currentIndex = STEPS_ORDER.indexOf(current)
  const progressPercent = ((currentIndex + 1) / STEPS_ORDER.length) * 100

  return (
    <div className="space-y-3">
      {/* Step labels */}
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        <span>
          Paso {currentIndex + 1} de {STEPS_ORDER.length}
        </span>
        <span className="text-aurora-2">{STEP_LABELS[current]}</span>
      </div>

      {/* Progress bar aurora */}
      <div className="relative h-1.5 overflow-hidden rounded-full bg-bg-raised/60">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,hsl(var(--aurora-1)),hsl(var(--aurora-2))_50%,hsl(var(--aurora-3)))] shadow-[0_0_12px_hsl(var(--aurora-2)/0.5)] transition-all duration-slow ease-out-expo"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between">
        {STEPS_ORDER.map((s, i) => (
          <div
            key={s}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-normal',
              i < currentIndex && 'bg-aurora-2',
              i === currentIndex && 'scale-150 bg-aurora-2 shadow-[0_0_8px_hsl(var(--aurora-2)/0.7)]',
              i > currentIndex && 'bg-bg-elevated',
            )}
          />
        ))}
      </div>
    </div>
  )
}
