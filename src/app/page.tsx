import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  Brain,
  ClipboardList,
  Flame,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { SparklesText } from '@/components/ui/sparkles-text'
import { Marquee } from '@/components/ui/marquee'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="relative min-h-screen">
      {/* ===== HERO ===== */}
      <AuroraBackground variant="intense" className="min-h-screen">
        {/* Nav minimal */}
        <header className="container relative z-20 flex h-16 items-center justify-between pt-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            EGEL<span className="text-aurora">Pro</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
            >
              Iniciar sesion
            </Link>
            <MagicButton variant="aurora" size="sm" asChild>
              <Link href="/register">Empezar gratis</Link>
            </MagicButton>
          </div>
        </header>

        <main className="container relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-10 py-16 text-center">
          {/* Badge */}
          <div className="animate-fade-in-up">
            <GlassCard
              variant="flat"
              padding="none"
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-aurora-2" />
              Nueva temporada CENEVAL 2026 ya disponible
            </GlassCard>
          </div>

          {/* H1 */}
          <h1
            className="animate-fade-in-up text-display-lg leading-[1.05] tracking-tight md:text-display-xl lg:text-display-2xl"
            style={{ animationDelay: '60ms' }}
          >
            Domina el{' '}
            <SparklesText className="text-aurora" count={10}>
              EGEL Plus
            </SparklesText>
            <br />
            <span className="text-foreground/90">como un experto</span>
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-in-up max-w-2xl text-base text-muted-foreground/90 md:text-lg lg:text-xl"
            style={{ animationDelay: '120ms' }}
          >
            Simulador con 203 reactivos oficiales, guias por subarea y una
            gamificacion estilo Duolingo que vuelve adictivo prepararte para el
            EGEL Plus ISOFT.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in-up flex flex-col items-center gap-4 sm:flex-row"
            style={{ animationDelay: '180ms' }}
          >
            <MagicButton variant="aurora" size="xl" asChild>
              <Link href="/register">
                Empezar gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </MagicButton>
            <MagicButton variant="outline" size="xl" asChild>
              <Link href="/login">Iniciar sesion</Link>
            </MagicButton>
          </div>

          {/* Trust strip */}
          <div
            className="animate-fade-in-up flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
            style={{ animationDelay: '240ms' }}
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" />
              100% reactivos oficiales CENEVAL
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-streak" />
              Racha diaria estilo Duolingo
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-cyan-ice" />
              Para estudiantes de ISOFT
            </span>
          </div>
        </main>
      </AuroraBackground>

      {/* ===== FEATURES ===== */}
      <section className="relative border-t border-bg-border/30 bg-bg-base/40 py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-display-sm tracking-tight md:text-display-md">
              Todo lo que necesitas para{' '}
              <span className="text-aurora">aprobar</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tres herramientas, un solo flow. Diseno pensado para que dejes de
              procrastinar y empieces a avanzar.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ClipboardList className="h-6 w-6" />}
              tint="aurora-1"
              title="Simulador 203 reactivos"
              description="Replica fiel del EGEL Plus ISOFT: 4 areas, 14 subareas, 2 sesiones de 4.5 horas. Practica corta o simulacro completo."
              highlight="A · B · C — 3 opciones reales"
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6" />}
              tint="aurora-2"
              title="Gamificacion adictiva"
              description="XP por respuesta correcta, rachas diarias, logros desbloqueables y 7 niveles de Aspirante a Sobresaliente."
              highlight="x1.5 bonus si haces 100%"
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              tint="aurora-3"
              title="Plan personalizado"
              description="Diagnostico inicial, deteccion de subareas debiles y guias de estudio adaptadas a tu fecha de examen."
              highlight="Datos oficiales CENEVAL oct 2025"
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              tint="brand-400"
              title="Flashcards inteligentes"
              description="Repaso espaciado para conceptos clave. Domina la teoria antes de tirarte al simulador."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              tint="cyan-ice"
              title="Guias por subarea"
              description="Material curado en Markdown para las 19 subareas del examen. Lee en cualquier dispositivo."
            />
            <FeatureCard
              icon={<Flame className="h-6 w-6" />}
              tint="streak"
              title="Racha diaria"
              description="Un quiz al dia para mantener la racha. Si te saltas un dia, pierdes el bonus de XP."
            />
          </div>
        </div>
      </section>

      {/* ===== MARQUEE KEYWORDS ===== */}
      <section className="relative border-y border-bg-border/30 bg-bg-base/60 py-10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <Marquee duration={50} className="[--gap:3rem]">
          {[
            'Analisis de SS',
            'Diseno de SS',
            'Desarrollo de SS',
            'Gestion de SS',
            'Bases de datos',
            'Algoritmos',
            'POO',
            'Arquitectura',
            'Testing',
            'DevOps',
            'CENEVAL',
            'ISOFT',
            'Ingenieria de Software',
          ].map((kw) => (
            <span
              key={kw}
              className="whitespace-nowrap text-base font-semibold text-muted-foreground/40 transition-colors hover:text-aurora-2"
            >
              {kw} <span className="ml-12 text-aurora-2/40">+</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-20 sm:py-28">
        <div className="container">
          <GlassCard variant="elevated" padding="xl" className="overflow-hidden">
            <div className="relative isolate">
              {/* Aurora glow inside CTA */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-aurora-mesh blur-3xl"
              />
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-display-sm tracking-tight md:text-display-md">
                  Tu plaza{' '}
                  <span className="text-aurora">no se va a regalar</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Crea tu cuenta gratis en 30 segundos y haz tu primer
                  diagnostico hoy mismo.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <MagicButton variant="aurora" size="xl" asChild>
                    <Link href="/register">
                      Crear cuenta gratis
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </MagicButton>
                  <MagicButton variant="ghost" size="xl" asChild>
                    <Link href="/login">Ya tengo cuenta</Link>
                  </MagicButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-bg-border/30 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            EGEL<span className="text-brand-400">Pro</span> ·{' '}
            <span className="text-muted-foreground/70">
              Hecho para estudiantes mexicanos
            </span>
          </p>
          <p className="text-xs">
            EGEL y CENEVAL son marcas registradas de sus respectivos propietarios.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  highlight,
  tint,
}: {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: string
  tint: 'aurora-1' | 'aurora-2' | 'aurora-3' | 'brand-400' | 'cyan-ice' | 'streak'
}) {
  return (
    <GlassCard variant="interactive" padding="lg" className="group h-full">
      <div
        className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg text-foreground transition-transform duration-normal group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, hsl(var(--${tint}) / 0.25), hsl(var(--${tint}) / 0.08))`,
          color: `hsl(var(--${tint}))`,
          boxShadow: `0 0 24px -8px hsl(var(--${tint}) / 0.4)`,
        }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {highlight ? (
        <p
          className="mt-4 inline-block rounded-full bg-bg-raised/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
          style={{ color: `hsl(var(--${tint}))` }}
        >
          {highlight}
        </p>
      ) : null}
    </GlassCard>
  )
}
