import { Button, Heading, Text, Section } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/EmailLayout'

type StreakWarningEmailProps = {
  fullName: string
  streakDays: number
  appUrl?: string
}

export default function StreakWarningEmail({
  fullName,
  streakDays,
  appUrl = 'https://egelpro.app',
}: StreakWarningEmailProps) {
  const firstName = fullName.split(/\s+/)[0] || 'estudiante'
  return (
    <EmailLayout preview={`Tu racha de ${streakDays} dias esta en riesgo!`}>
      <Heading className="text-2xl font-bold">
        🔥 No pierdas tu racha, {firstName}
      </Heading>
      <Text className="text-base text-slate-300">
        Llevas <strong className="text-orange-400">{streakDays} dias</strong>{' '}
        seguidos estudiando. Si no haces al menos 1 quiz hoy, tu racha se reinicia
        a 0.
      </Text>

      <Section className="my-4 rounded-md border border-orange-900/30 bg-orange-950/30 p-4">
        <Text className="m-0 text-center text-sm text-orange-300">
          ⏰ Tienes hasta las 11:59 PM para mantener tu racha
        </Text>
      </Section>

      <Section className="my-6 text-center">
        <Button
          href={`${appUrl}/quiz`}
          className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Hacer un quiz de 2 minutos
        </Button>
      </Section>

      <Text className="text-sm text-slate-400">
        Solo necesitas responder 5 preguntas para no perder tu racha. Animo!
      </Text>
    </EmailLayout>
  )
}

StreakWarningEmail.PreviewProps = {
  fullName: 'Maria Lopez',
  streakDays: 7,
} as StreakWarningEmailProps
