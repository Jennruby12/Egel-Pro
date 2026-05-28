import type { Metadata } from 'next'
import { GlassCard } from '@/components/ui/glass-card'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'

export const metadata: Metadata = { title: 'Crear cuenta' }

export default function RegisterPage() {
  return (
    <GlassCard variant="elevated" padding="lg" className="space-y-7">
      <header className="space-y-2 text-center">
        <h1 className="text-display-sm tracking-tight">
          Crea tu cuenta <span className="text-aurora">gratis</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Empieza a practicar con reactivos oficiales del EGEL Plus ISOFT en menos
          de 2 minutos.
        </p>
      </header>
      <RegisterForm />
    </GlassCard>
  )
}
