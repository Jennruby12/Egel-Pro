import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { PageTransition } from '@/components/layout/PageTransition'
import { OfflineIndicator } from '@/components/shared/OfflineIndicator'
import { InstallPWABanner } from '@/components/shared/InstallPWABanner'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { XPGainPortal } from '@/modules/gamification/components/XPGainFloater'
import { StreakTouch } from '@/modules/gamification/components/StreakTouch'
import type { Role } from '@/types/global'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  const role = (profile?.role ?? 'student') as Role

  return (
    <AuroraBackground variant="subtle" className="min-h-screen">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar role={role} />

        <div className="flex flex-1 flex-col">
          <Header
            fullName={profile?.full_name ?? null}
            email={profile?.email ?? user.email ?? ''}
            xpTotal={profile?.xp_total ?? 0}
            level={profile?.level ?? 1}
            streakCurrent={profile?.streak_current ?? 0}
          />
          <main className="safe-x flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <OfflineIndicator />
          <InstallPWABanner />
          <MobileNav />
          {/* Portal global de XP floaters — montado UNA sola vez por app.
              Cualquier componente puede invocar triggerXPGain(amount, origin). */}
          <XPGainPortal />
          {/* Racha estilo TikTok: cada visita diaria mantiene viva la racha. */}
          <StreakTouch />
        </div>
      </div>
    </AuroraBackground>
  )
}
