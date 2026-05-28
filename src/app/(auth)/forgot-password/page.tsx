import type { Metadata } from 'next'
import { GlassCard } from '@/components/ui/glass-card'
import { ForgotPasswordForm } from '@/modules/auth/components/ForgotPasswordForm'

export const metadata: Metadata = { title: 'Recuperar contrasena' }

export default function ForgotPasswordPage() {
  return (
    <GlassCard variant="elevated" padding="lg" className="space-y-7">
      <header className="space-y-2 text-center">
        <h1 className="text-display-sm tracking-tight">
          Recuperar <span className="text-aurora">contrasena</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu email y te enviamos un link para restablecerla al instante.
        </p>
      </header>
      <ForgotPasswordForm />
    </GlassCard>
  )
}
