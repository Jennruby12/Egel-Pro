import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { cookies } from 'next/headers'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/lib/theme/provider'
import { THEME_COOKIE, DEFAULT_THEME, type Theme } from '@/lib/theme/types'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const siteTitle = 'EGELPro — Preparate para el EGEL Plus ISOFT'
const siteDescription =
  'Simulador, guias y gamificacion para aprobar el EGEL Plus ISOFT (CENEVAL).'

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: '%s | EGELPro',
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  keywords: [
    'EGEL',
    'CENEVAL',
    'ISOFT',
    'preparacion',
    'simulador',
    'examen',
    'ingenieria de software',
  ],
  authors: [{ name: 'EGELPro' }],
  alternates: { canonical: '/' },
  // Las imagenes OG/Twitter las genera Next por convencion de archivo
  // (src/app/opengraph-image.tsx y twitter-image.tsx) en PNG, que SI renderiza
  // en redes sociales (el SVG no).
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: siteUrl,
    siteName: 'EGELPro',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
  verification: {},
  manifest: '/manifest.json',
  icons: { apple: '/icons/icon-192.png' },
}

// theme-color va en viewport segun la App Router metadata API (Next.js >=14)
// Se sincroniza con el tema activo (dark/light) via JS, pero el SSR usa el de dark.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#060716' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Leer cookie de tema en SSR para evitar flash de color incorrecto
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value
  const theme: Theme = themeCookie === 'light' ? 'light' : DEFAULT_THEME
  const htmlClass = theme === 'light' ? 'light' : ''

  return (
    <html lang="es" className={htmlClass} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${GeistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider initialTheme={theme}>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              // Estilos Aurora: glass base + tinte/glow por severidad.
              // Sonner aplica `data-type` segun toast.success / .error / .warning / .info,
              // y richColors anade `data-rich-colors`. Aprovechamos esos hooks por type.
              classNames: {
                toast:
                  'glass border border-glass-border/40 backdrop-blur-xl shadow-elev-4 data-[type=success]:border-success/40 data-[type=success]:shadow-[0_0_24px_-6px_hsl(var(--success)/0.5)] data-[type=error]:border-danger/40 data-[type=error]:shadow-[0_0_24px_-6px_hsl(var(--danger)/0.5)] data-[type=warning]:border-warning/40 data-[type=warning]:shadow-[0_0_24px_-6px_hsl(var(--warning)/0.5)] data-[type=info]:border-aurora-2/40 data-[type=info]:shadow-[0_0_24px_-6px_hsl(var(--aurora-2)/0.5)]',
                title:       'text-foreground font-semibold',
                description: 'text-muted-foreground text-xs',
                actionButton: 'bg-brand-400 text-primary-foreground hover:bg-brand-500',
                cancelButton: 'bg-bg-raised text-foreground hover:bg-bg-elevated',
                closeButton:  'bg-bg-raised border border-bg-border text-muted-foreground hover:text-foreground',
                success: 'text-success',
                error:   'text-danger',
                warning: 'text-warning',
                info:    'text-aurora-2',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
