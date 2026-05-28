import { Button, Heading, Text, Section, Row, Column } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/EmailLayout'

type WeeklyReportEmailProps = {
  fullName: string
  xpEarned: number
  questionsAnswered: number
  averageAccuracy: number
  currentStreak: number
  appUrl?: string
}

export default function WeeklyReportEmail({
  fullName,
  xpEarned,
  questionsAnswered,
  averageAccuracy,
  currentStreak,
  appUrl = 'https://egelpro.app',
}: WeeklyReportEmailProps) {
  const firstName = fullName.split(/\s+/)[0] || 'estudiante'
  return (
    <EmailLayout preview={`Tu semana en EGELPro: ${xpEarned} XP ganados`}>
      <Heading className="text-2xl font-bold">
        📊 Resumen semanal, {firstName}
      </Heading>
      <Text className="text-base text-slate-300">
        Asi te fue esta semana en tu preparacion:
      </Text>

      <Section className="my-4 rounded-md border border-slate-800 bg-slate-950 p-6">
        <Row>
          <Column className="text-center">
            <Text className="m-0 text-2xl font-bold text-yellow-400">{xpEarned}</Text>
            <Text className="m-0 text-xs uppercase text-slate-500">XP</Text>
          </Column>
          <Column className="text-center">
            <Text className="m-0 text-2xl font-bold text-sky-400">{questionsAnswered}</Text>
            <Text className="m-0 text-xs uppercase text-slate-500">Preguntas</Text>
          </Column>
          <Column className="text-center">
            <Text className="m-0 text-2xl font-bold text-emerald-400">{averageAccuracy}%</Text>
            <Text className="m-0 text-xs uppercase text-slate-500">Precision</Text>
          </Column>
          <Column className="text-center">
            <Text className="m-0 text-2xl font-bold text-orange-400">{currentStreak}</Text>
            <Text className="m-0 text-xs uppercase text-slate-500">Racha</Text>
          </Column>
        </Row>
      </Section>

      <Text className="text-base text-slate-300">
        {averageAccuracy >= 80
          ? 'Excelente trabajo. Sigue asi y vas a destacar en el examen.'
          : averageAccuracy >= 60
            ? 'Buen ritmo. Enfocate en las areas mas debiles para subir tu precision.'
            : 'Hay espacio para mejorar. Revisa las guias de estudio antes de practicar.'}
      </Text>

      <Section className="my-6 text-center">
        <Button
          href={`${appUrl}/progress`}
          className="rounded-md bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Ver progreso detallado
        </Button>
      </Section>
    </EmailLayout>
  )
}

WeeklyReportEmail.PreviewProps = {
  fullName: 'Maria Lopez',
  xpEarned: 320,
  questionsAnswered: 50,
  averageAccuracy: 76,
  currentStreak: 7,
} as WeeklyReportEmailProps
