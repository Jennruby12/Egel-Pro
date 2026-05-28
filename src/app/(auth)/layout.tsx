import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { PageTransition } from '@/components/layout/PageTransition'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <AuroraBackground variant="normal" className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="container flex h-16 items-center justify-between pt-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            EGEL<span className="text-aurora">Pro</span>
          </Link>
          <ThemeToggle />
        </header>

        {/* Form area */}
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
          <div className="w-full max-w-md animate-fade-in-up">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>

        {/* Footer mini */}
        <footer className="container py-6 text-center text-xs text-muted-foreground/70">
          Al continuar aceptas los terminos de uso de EGEL
          <span className="text-brand-400">Pro</span>.
        </footer>
      </div>
    </AuroraBackground>
  )
}
