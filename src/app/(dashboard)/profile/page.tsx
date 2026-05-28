import { redirect } from 'next/navigation'
import { Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/ui/glass-card'
import { PageHeader } from '@/components/layout/PageHeader'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ProfileForm } from '@/modules/auth/components/ProfileForm'
import { AvatarUpload } from '@/modules/auth/components/AvatarUpload'
import { ChangePasswordForm } from '@/modules/auth/components/ChangePasswordForm'
import { DangerZone } from '@/modules/auth/components/DangerZone'

export const metadata = { title: 'Perfil' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Perfil" description="Gestiona tu cuenta y preferencias." gradient />

      <GlassCard variant="elevated" padding="lg">
        <h2 className="mb-4 text-lg font-semibold">Avatar</h2>
        <AvatarUpload userId={user.id} currentAvatarUrl={profile.avatar_url} email={profile.email} />
      </GlassCard>

      <GlassCard variant="elevated" padding="lg">
        <h2 className="mb-1 text-lg font-semibold">Datos personales</h2>
        <p className="mb-5 text-sm text-muted-foreground">Tu nombre, universidad y meta de estudio.</p>
        <ProfileForm profile={profile} />
      </GlassCard>

      <GlassCard variant="elevated" padding="lg">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
          <Palette className="h-4 w-4 text-aurora-2" />
          Apariencia
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Cambia entre modo oscuro (Nebulosa Profunda) y modo claro.
        </p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Tema</p>
            <p className="text-xs text-muted-foreground">Click en el icono para alternar</p>
          </div>
          <ThemeToggle size="lg" />
        </div>
      </GlassCard>

      <GlassCard variant="elevated" padding="lg">
        <h2 className="mb-1 text-lg font-semibold">Cuenta</h2>
        <p className="mb-5 text-sm text-muted-foreground">Email y contrasena.</p>
        <div className="space-y-5">
          <div className="text-sm">
            <span className="text-muted-foreground">Email actual:</span>{' '}
            <span className="font-medium">{profile.email}</span>
          </div>
          <ChangePasswordForm />
        </div>
      </GlassCard>

      <GlassCard variant="flat" padding="lg" className="border-danger/30">
        <h2 className="mb-3 text-lg font-semibold text-danger">Zona peligrosa</h2>
        <DangerZone />
      </GlassCard>
    </div>
  )
}
