'use client'

import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/theme/provider'
import { cn } from '@/lib/utils/cn'

type Props = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE = {
  sm: { container: 'h-7 w-7', icon: 'h-3.5 w-3.5' },
  md: { container: 'h-9 w-9', icon: 'h-4 w-4' },
  lg: { container: 'h-11 w-11', icon: 'h-5 w-5' },
} as const

export function ThemeToggle({ className, size = 'md' }: Props) {
  const { theme, toggleTheme } = useTheme()
  const s = SIZE[size]

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      className={cn(
        'relative flex items-center justify-center rounded-full',
        'bg-bg-raised text-foreground hover:bg-bg-elevated',
        'transition-colors duration-normal',
        s.container,
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className={cn(s.icon, 'text-brand-400')} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className={cn(s.icon, 'text-xp')} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
