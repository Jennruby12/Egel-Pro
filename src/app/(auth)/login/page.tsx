import type { Metadata } from 'next'
import { GlassCard } from '@/components/ui/glass-card'
import { LoginForm } from '@/modules/auth/components/LoginForm'

export const metadata: Metadata = { title: 'Iniciar sesion' }

export default function LoginPage() {
  return (
    <GlassCard variant="elevated" padding="lg" className="space-y-7">
      <header className="space-y-2 text-center">
        <h1 className="text-display-sm tracking-tight">
          Bienvenido de <span className="text-aurora">vuelta</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Continua donde quedaste con tu preparacion para el EGEL.
        </p>
      </header>
      <LoginForm />
    </GlassCard>
  )
}
