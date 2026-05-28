import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

type EmailLayoutProps = {
  preview: string
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-slate-950 font-sans text-slate-100">
          <Container className="mx-auto my-10 max-w-xl rounded-lg border border-slate-800 bg-slate-900 p-8">
            <Section className="mb-6">
              <Text className="text-2xl font-bold tracking-tight">
                EGEL<span className="text-sky-400">Pro</span>
              </Text>
            </Section>

            {children}

            <Hr className="my-8 border-slate-800" />

            <Section>
              <Text className="text-xs text-slate-500">
                Recibiste este email porque te registraste en EGELPro.
                <br />
                <Link href="https://egelpro.app/profile" className="text-slate-400 underline">
                  Administrar notificaciones
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
