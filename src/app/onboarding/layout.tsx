import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MagicButton } from '@/components/ui/magic-button'
import { PageTransition } from '@/components/layout/PageTransition'
import { skipOnboarding } from '@/modules/onboarding/actions'

export default async function OnboardingLayout({
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
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <AuroraBackground variant="subtle" className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header glass */}
        <header className="sticky top-0 z-30 border-b border-bg-border/40 glass">
          <div className="container flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
            >
              EGEL<span className="text-aurora">Pro</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle size="sm" />
              <form action={skipOnboarding}>
                <MagicButton type="submit" variant="ghost" size="sm">
                  Saltar por ahora
                </MagicButton>
              </form>
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-2xl flex-1 px-4 py-10 sm:py-14">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AuroraBackground>
  )
}
