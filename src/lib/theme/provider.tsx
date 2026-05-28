'use client'

import * as React from 'react'
import { setThemeCookie } from './actions'
import { type Theme, DEFAULT_THEME } from './types'

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme
  children: React.ReactNode
}) {
  const [theme, setThemeState] = React.useState<Theme>(initialTheme)

  const applyToDOM = React.useCallback((t: Theme) => {
    const html = document.documentElement
    if (t === 'light') html.classList.add('light')
    else html.classList.remove('light')
  }, [])

  const setTheme = React.useCallback(
    (t: Theme) => {
      setThemeState(t)
      applyToDOM(t)
      void setThemeCookie(t)
    },
    [applyToDOM],
  )

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = React.useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    // Fallback gracioso si se usa fuera del provider (no rompe)
    return {
      theme: DEFAULT_THEME,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  return ctx
}
