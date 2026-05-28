import { Button, Heading, Text, Section } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/EmailLayout'

type WelcomeEmailProps = {
  fullName: string
  appUrl?: string
}

export default function WelcomeEmail({ fullName, appUrl = 'https://egelpro.app' }: WelcomeEmailProps) {
  const firstName = fullName.split(/\s+/)[0] || 'estudiante'
  return (
    <EmailLayout preview={`Bienvenido a EGELPro, ${firstName}!`}>
      <Heading className="text-2xl font-bold">
        Bienvenido, {firstName} 👋
      </Heading>
      <Text className="text-base text-slate-300">
        Estas listo para empezar tu preparacion para el EGEL Plus ISOFT.
        En EGELPro encontraras:
      </Text>

      <Section className="my-4 rounded-md border border-slate-800 bg-slate-950 p-4">
        <Text className="m-0 text-sm text-slate-300">✅ Banco de preguntas oficial</Text>
        <Text className="m-0 text-sm text-slate-300">✅ Simulacro completo de 203 reactivos</Text>
        <Text className="m-0 text-sm text-slate-300">✅ Guias de estudio por subarea</Text>
        <Text className="m-0 text-sm text-slate-300">✅ Racha diaria y gamificacion estilo Duolingo</Text>
      </Section>

      <Text className="text-base text-slate-300">
        Empieza con tu primer quiz de 10 preguntas. Solo te toma 5 minutos.
      </Text>

      <Section className="my-6 text-center">
        <Button
          href={`${appUrl}/quiz`}
          className="rounded-md bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Hacer mi primer quiz
        </Button>
      </Section>

      <Text className="text-sm text-slate-400">
        Tip: si haces al menos 1 quiz cada dia, mantienes tu racha activa y
        ganas un bonus de XP del 20%.
      </Text>
    </EmailLayout>
  )
}

WelcomeEmail.PreviewProps = {
  fullName: 'Maria Lopez',
} as WelcomeEmailProps
