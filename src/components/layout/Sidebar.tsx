'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  TrendingUp,
  Trophy,
  User,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Role } from '@/types/global'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/quiz',         label: 'Practicar',    icon: Brain },
  { href: '/simulacro',    label: 'Simulacro',    icon: Sparkles },
  { href: '/study',        label: 'Estudiar',     icon: BookOpen },
  { href: '/progress',     label: 'Progreso',     icon: TrendingUp },
  { href: '/achievements', label: 'Logros',       icon: Trophy },
  { href: '/profile',      label: 'Perfil',       icon: User },
  { href: '/admin',        label: 'Admin',        icon: Settings, adminOnly: true },
]

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === 'admin')

  return (
    <aside className="relative hidden w-60 shrink-0 border-r border-bg-border/50 md:block">
      {/* Glass backdrop */}
      <div className="glass absolute inset-0 rounded-none border-l-0 border-t-0 border-b-0" />

      <div className="sticky top-0 flex h-screen flex-col">
        <Link
          href="/dashboard"
          className="flex h-16 items-center gap-2 border-b border-bg-border/40 px-6 text-lg font-bold"
        >
          <span className="text-aurora">EGEL</span>
          <span className="text-foreground">Pro</span>
        </Link>

        <nav className="flex-1 space-y-0.5 p-3">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-fast',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {/* Active background con glow */}
                {active ? (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-bg-raised/80 shadow-glow-brand"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : null}

                {/* Hover background sutil */}
                <div className="absolute inset-0 rounded-lg bg-bg-raised/0 transition-colors group-hover:bg-bg-raised/40" />

                <Icon
                  className={cn(
                    'relative z-10 h-4 w-4 transition-colors',
                    active ? 'text-brand-400' : 'text-muted-foreground group-hover:text-foreground',
                  )}
                />
                <span className="relative z-10">{item.label}</span>

                {/* Glow dot al lado derecho cuando activo */}
                {active ? (
                  <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-brand-400 shadow-glow-brand" />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-bg-border/40 p-3 text-xs text-muted-foreground">
          <p className="font-mono">EGELPro v0.2 · Aurora</p>
        </div>
      </div>
    </aside>
  )
}
