'use server'

import { cookies } from 'next/headers'
import { THEME_COOKIE, type Theme } from './types'

const ONE_YEAR = 60 * 60 * 24 * 365

/** Server Action: cambia el tema y lo guarda en cookie SSR-safe */
export async function setThemeCookie(theme: Theme): Promise<void> {
  const store = await cookies()
  store.set(THEME_COOKIE, theme, {
    maxAge: ONE_YEAR,
    sameSite: 'lax',
    path: '/',
  })
}
