import { Button, Heading, Text, Section } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/EmailLayout'

type ExamReminderEmailProps = {
  fullName: string
  daysToExam: number
  estimatedLevel: 'ans' | 'satisfactorio' | 'sobresaliente'
  appUrl?: string
}

const LEVEL_LABEL: Record<ExamReminderEmailProps['estimatedLevel'], string> = {
  ans: 'Aun No Satisfactorio',
  satisfactorio: 'Satisfactorio',
  sobresaliente: 'Sobresaliente',
}

export default function ExamReminderEmail({
  fullName,
  daysToExam,
  estimatedLevel,
  appUrl = 'https://egelpro.app',
}: ExamReminderEmailProps) {
  const firstName = fullName.split(/\s+/)[0] || 'estudiante'
  return (
    <EmailLayout preview={`Faltan ${daysToExam} dias para tu EGEL`}>
      <Heading className="text-2xl font-bold">
        ⏰ Faltan {daysToExam} dias, {firstName}
      </Heading>
      <Text className="text-base text-slate-300">
        Tu fecha de examen se acerca. Asi vas:
      </Text>

      <Section className="my-4 rounded-md border border-sky-900/30 bg-sky-950/30 p-6 text-center">
        <Text className="m-0 text-sm uppercase text-slate-400">Nivel estimado actual</Text>
        <Text className="m-0 mt-1 text-2xl font-bold text-sky-300">
          {LEVEL_LABEL[estimatedLevel]}
        </Text>
      </Section>

      <Text className="text-base text-slate-300">
        {daysToExam <= 7
          ? 'Esta semana enfocate en simulacros completos para acostumbrarte al ritmo del examen real.'
          : daysToExam <= 30
            ? 'Tienes tiempo para reforzar areas debiles. Haz al menos un simulacro completo en las proximas 2 semanas.'
            : 'Construye tu base con quizzes diarios y guias de estudio. Empieza a hacer simulacros completos a partir del mes anterior al examen.'}
      </Text>

      <Section className="my-6 text-center">
        <Button
          href={`${appUrl}/quiz`}
          className="rounded-md bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Empezar simulacro
        </Button>
      </Section>
    </EmailLayout>
  )
}

ExamReminderEmail.PreviewProps = {
  fullName: 'Maria Lopez',
  daysToExam: 30,
  estimatedLevel: 'satisfactorio',
} as ExamReminderEmailProps
