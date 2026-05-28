import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Settings,
  FileQuestion,
  BookOpen,
  Users,
  LayoutDashboard,
  ArrowLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/modules/auth/actions'
import { MagicButton } from '@/components/ui/magic-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/questions', label: 'Preguntas', icon: FileQuestion },
  { href: '/admin/guides', label: 'Guias', icon: BookOpen },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
] as const

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar admin: enterprise, mas sobrio */}
      <aside className="hidden w-56 shrink-0 border-r border-bg-border bg-bg-surface md:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <Link
            href="/admin"
            className="flex h-16 items-center gap-2 border-b border-bg-border px-6 text-lg font-bold"
          >
            <Settings className="h-4 w-4 text-brand-400" />
            <span>Admin</span>
            <span className="text-aurora text-xs">Pro</span>
          </Link>

          <nav className="flex-1 space-y-1 p-3">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-bg-raised hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="space-y-2 border-t border-bg-border p-3 text-xs">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver a la app
            </Link>
            <form action={signOut}>
              <MagicButton type="submit" variant="ghost" size="sm" className="w-full justify-start">
                Cerrar sesion
              </MagicButton>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-bg-border bg-bg-surface/95 px-4 backdrop-blur md:px-6">
          <Link href="/admin" className="font-bold md:hidden">
            <Settings className="inline h-4 w-4 text-brand-400" /> Admin
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">
              {profile?.full_name ?? profile?.email}
            </span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  )
}
