'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Brain, BookOpen, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const ITEMS = [
  { href: '/dashboard',    label: 'Inicio',    icon: LayoutDashboard },
  { href: '/quiz',         label: 'Practicar', icon: Brain },
  { href: '/study',        label: 'Estudiar',  icon: BookOpen },
  { href: '/progress',     label: 'Progreso',  icon: TrendingUp },
  { href: '/profile',      label: 'Perfil',    icon: User },
] as const

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav
      className="fixed inset-x-2 bottom-2 z-50 md:hidden"
      aria-label="Navegacion principal mobile"
    >
      <div className="glass-strong relative rounded-2xl shadow-elev-4">
        <ul className="grid grid-cols-5 px-2 py-2">
          {ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition-colors',
                    active ? 'text-brand-400' : 'text-muted-foreground',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="mobile-active-pill"
                      className="absolute inset-0 rounded-xl bg-bg-raised/80 shadow-glow-brand"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  <Icon
                    className={cn(
                      'relative z-10 h-5 w-5 transition-transform',
                      active && 'scale-110',
                    )}
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
