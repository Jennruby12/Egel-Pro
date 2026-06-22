'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { MermaidDiagram } from '@/components/ui/MermaidDiagram'
import { OptionMedia } from '@/modules/quiz/components/OptionMedia'

type Props = {
  area: number
  subarea: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  correctAnswer: 'a' | 'b' | 'c'
  difficulty: 'easy' | 'medium' | 'hard'
  explanation?: string | null
  diagram?: string | null
  imageUrl?: string | null
  optionAImage?: string | null
  optionBImage?: string | null
  optionCImage?: string | null
  optionADiagram?: string | null
  optionBDiagram?: string | null
  optionCDiagram?: string | null
}

const DIFFICULTY_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'destructive',
}

export function QuestionPreview(props: Props) {
  const options: Array<{
    label: 'a' | 'b' | 'c'
    text: string
    image?: string | null
    diagram?: string | null
  }> = [
    { label: 'a', text: props.optionA, image: props.optionAImage, diagram: props.optionADiagram },
    { label: 'b', text: props.optionB, image: props.optionBImage, diagram: props.optionBDiagram },
    { label: 'c', text: props.optionC, image: props.optionCImage, diagram: props.optionCDiagram },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Vista previa</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">A{props.area}.{props.subarea}</Badge>
            <Badge variant={DIFFICULTY_VARIANT[props.difficulty]}>{props.difficulty}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium leading-relaxed">
          {props.questionText || <span className="text-muted-foreground">[texto de la pregunta]</span>}
        </p>
        {props.diagram ? <MermaidDiagram chart={props.diagram} /> : null}
        {props.imageUrl ? (
          <div className="overflow-hidden rounded-lg border border-bg-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={props.imageUrl} alt="" className="max-h-[300px] w-full object-contain" />
          </div>
        ) : null}
        <ul className="space-y-2">
          {options.map((opt) => {
            const isCorrect = opt.label === props.correctAnswer
            return (
              <li
                key={opt.label}
                className={cn(
                  'flex items-start gap-3 rounded-md border p-3 text-sm',
                  isCorrect
                    ? 'border-success/50 bg-success/10'
                    : 'border-bg-border bg-bg-base',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase',
                    isCorrect ? 'bg-success text-bg-base' : 'bg-bg-raised',
                  )}
                >
                  {opt.label}
                </span>
                <span className="min-w-0 leading-relaxed">
                  {opt.text || (!opt.image && !opt.diagram ? (
                    <span className="text-muted-foreground">[opcion {opt.label}]</span>
                  ) : null)}
                  <OptionMedia image={opt.image} diagram={opt.diagram} />
                </span>
                {isCorrect ? (
                  <span className="ml-auto text-xs font-medium text-success">Correcta</span>
                ) : null}
              </li>
            )
          })}
        </ul>

        {props.explanation ? (
          <div className="rounded-md bg-bg-base p-3 text-sm text-muted-foreground">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">
              Explicacion
            </p>
            <p className="leading-relaxed">{props.explanation}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
