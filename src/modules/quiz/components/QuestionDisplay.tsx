'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import type { QuizQuestionForClient } from '@/modules/quiz/types'

type QuestionDisplayProps = {
  question: QuizQuestionForClient
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Facil',
  medium: 'Media',
  hard: 'Dificil',
}

const DIFFICULTY_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'destructive',
}

const AREA_BADGE: Record<number, string> = {
  1: 'bg-area1/15 text-area1 border-area1/40',
  2: 'bg-area2/15 text-area2 border-area2/40',
  3: 'bg-area3/15 text-area3 border-area3/40',
  4: 'bg-area4/15 text-area4 border-area4/40',
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  const difficulty = question.difficulty ?? 'medium'
  const areaClass = AREA_BADGE[question.area] ?? 'bg-bg-raised text-muted-foreground border-bg-border'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold backdrop-blur-md',
            areaClass,
          )}
        >
          Area {question.area}
          {question.area_name ? ` — ${question.area_name}` : ''}
        </span>
        {question.subarea_name && (
          <span className="inline-flex items-center rounded-full border border-bg-border/60 bg-bg-raised/40 px-2.5 py-0.5 text-xs font-medium text-foreground/80 backdrop-blur-md">
            Tema: {question.subarea_name}
          </span>
        )}
        <Badge variant={DIFFICULTY_VARIANT[difficulty] ?? 'secondary'}>
          {DIFFICULTY_LABEL[difficulty] ?? difficulty}
        </Badge>
      </div>
      <h2 className="text-xl font-medium leading-relaxed md:text-2xl">
        {question.question_text}
      </h2>
    </div>
  )
}
