# CLAUDE.md — EGELPro
> Lee este archivo completo antes de tocar cualquier codigo.

---

## PROYECTO

**EGELPro** — SaaS de preparacion para el EGEL Plus ISOFT (CENEVAL, Mexico).
Simulador de examen + guias de estudio + gamificacion estilo Duolingo.

**Stack:** Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui + Supabase + Vercel
**MCP disponible:** Supabase MCP (usar para DB, migrations, tipos)

---

## COMANDOS DIARIOS

```bash
npm run dev          # Dev server localhost:3000
npm run build        # Build produccion
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright e2e
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run db:push      # Aplicar migrations Supabase
npm run db:types     # Regenerar src/types/database.ts
npm run db:reset     # Reset DB + seed
```

---

## ESTRUCTURA DEL PROYECTO (Feature-Based)

```
src/
├── app/                    ← Next.js App Router (SOLO rutas y layouts)
│   ├── (auth)/             ← Publico: login, register, forgot-password
│   ├── (dashboard)/        ← Privado: toda la app del usuario
│   └── (admin)/            ← Solo role=admin
├── modules/                ← TODA la logica va aqui, por feature
│   ├── auth/               ← Login, register, perfil
│   ├── quiz/               ← Motor del simulador
│   ├── questions/          ← Banco de preguntas
│   ├── study/              ← Guias de estudio + flashcards
│   ├── gamification/       ← XP, rachas, logros
│   ├── progress/           ← Dashboard de analíticas
│   ├── dashboard/          ← Home principal
│   ├── onboarding/         ← Flow de nuevo usuario
│   ├── admin/              ← Panel admin
│   └── notifications/      ← Emails y push
├── lib/
│   ├── supabase/           ← client.ts, server.ts, middleware.ts
│   ├── validations/        ← Zod schemas
│   ├── constants/          ← egel.ts, gamification.ts, routes.ts
│   └── utils/              ← cn.ts, format.ts, errors.ts
├── components/
│   ├── ui/                 ← shadcn/ui (auto-generados, NO editar)
│   ├── layout/             ← Sidebar, Header, MobileNav
│   └── shared/             ← LoadingSpinner, EmptyState, ErrorBoundary
└── types/
    ├── database.ts         ← Auto-generado por Supabase CLI
    └── global.ts
```

---

## REGLA #1 — DONDE VA CADA COSA

| Necesito... | Lo pongo en... |
|---|---|
| Fetchear datos | Server Component (`async function Page()`) |
| Mutar datos (crear, editar, borrar) | Server Action en `modules/X/actions.ts` |
| Estado del cliente | Zustand store o useState |
| Validacion de inputs | Zod schema en `lib/validations/` |
| Constantes del examen | `lib/constants/egel.ts` — NUNCA hardcodear |
| Logica pura (sin React) | `modules/X/lib/*.ts` |
| Componentes UI | `modules/X/components/` o `components/shared/` |

---

## PATRON OBLIGATORIO — SERVER ACTION

```typescript
'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const Schema = z.object({ /* campos tipados */ })

export async function miAction(input: z.infer<typeof Schema>) {
  // 1. VALIDAR con Zod — SIEMPRE primero
  const validated = Schema.safeParse(input)
  if (!validated.success) return { error: 'Datos invalidos' }

  // 2. AUTH — SIEMPRE verificar
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 3. OWNERSHIP — verificar que el usuario es dueño del recurso
  // Nunca confiar en IDs que vienen del cliente

  // 4. DB — operar
  const { data, error } = await supabase.from('tabla').insert({...}).select().single()
  if (error) return { error: 'Error al guardar' }

  // 5. REVALIDAR
  revalidatePath('/ruta')
  return { success: true, data }
}
```

---

## PATRON OBLIGATORIO — SERVER COMPONENT (data fetching)

```typescript
// src/app/(dashboard)/X/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch en paralelo siempre que sea posible
  const [profileResult, dataResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('mi_tabla').select('*').eq('user_id', user.id),
  ])

  return <ClientComponent profile={profileResult.data} data={dataResult.data ?? []} />
}
```

---

## REGLAS DE SEGURIDAD (NUNCA ROMPER)

1. `SUPABASE_SERVICE_ROLE_KEY` — SOLO en Server Actions o Edge Functions. NUNCA en el cliente.
2. Validar con Zod ANTES de cualquier operacion de DB
3. Verificar `auth.getUser()` en CADA Server Action
4. No usar `select('*')` innecesariamente — seleccionar solo campos necesarios
5. RLS activo en todas las tablas — el schema SQL ya lo tiene configurado
6. NUNCA `throw` en Server Actions — siempre `return { error: string }`
7. `NEXT_PUBLIC_` solo en variables que el cliente NECESITA ver

---

## BASE DE DATOS — TABLAS PRINCIPALES

| Tabla | Uso |
|---|---|
| `profiles` | Extiende auth.users — perfil, rol, XP, racha, plan |
| `organizations` | Tenants (universidades) |
| `questions` | Banco de preguntas del EGEL |
| `stimuli` | Textos para multirreactivos (comprension lectora) |
| `study_guides` | Guias de estudio por subarea (Markdown) |
| `flashcards` | Tarjetas de flashcard |
| `quiz_sessions` | Sesiones de practica/simulacro |
| `quiz_answers` | Respuestas por sesion |
| `user_progress` | Precision actual por area/subarea |
| `streaks` | Historial diario de actividad |
| `achievements` | Logros desbloqueados |
| `areas_catalog` | Referencia inmutable areas/subareas del EGEL |

**Tipos de DB:** siempre importar desde `@/types/database.ts`
```typescript
import type { Tables } from '@/types/database'
type Question = Tables<'questions'>
```

---

## EXAMEN EGEL — DATOS OFICIALES (CENEVAL oct 2025)

```
Total reactivos: 203
  Disciplinar:  143 reactivos en 4 areas y 14 subareas
  Transversal:   60 reactivos en 2 areas y 5 subareas

Tiempo: 2 sesiones de 4.5 horas (16,200 segundos cada una)
Opciones: siempre A, B, C (3 opciones, NO 4)
Reactivos piloto: 15% (no cuentan para score)

Areas disciplinares:
  Area 1 — Analisis de SS:    31 reactivos (subareas: 12, 9, 10)
  Area 2 — Diseno de SS:      33 reactivos (subareas: 10, 16, 7)
  Area 3 — Desarrollo de SS:  49 reactivos (subareas: 10, 10, 10, 9, 10)
  Area 4 — Gestion de SS:     30 reactivos (subareas: 8, 10, 12)

Niveles de desempeno:
  ANS:           < 60%
  Satisfactorio: 60% - 79%
  Sobresaliente: >= 80%

Importar siempre desde: @/lib/constants/egel.ts
```

---

## GAMIFICACION — VALORES

```
XP por modo:
  practice:        10 pts/correcta
  quick_exam:      15 pts/correcta
  full_simulacro:  20 pts/correcta
  review:          12 pts/correcta
  flashcards:       8 pts/completada

Bonuses:
  racha activa: x1.2
  score 100%:   x1.5 (solo si correctas === total)

Niveles (XP acumulado):
  1 Aspirante:     0
  2 Estudiante:    200
  3 Practicante:   600
  4 Avanzado:    1,500
  5 Experto:     3,500
  6 Maestro:     7,000
  7 Sobresaliente: 15,000

Importar desde: @/lib/constants/gamification.ts
```

---

## ROLES Y PERMISOS

| Rol | Descripcion |
|---|---|
| `student` | Usuario individual — ve solo sus datos |
| `admin` | Super admin — ve todo, gestiona contenido |
| `org_member` | Alumno de universidad |
| `org_manager` | Coordinador — ve datos de su org |
| `org_owner` | Admin de universidad |

---

## DISENO (Design System)

```
Colores principales:
  Brand:   #38bdf8 (azul cielo)  → text-brand-400
  Accent:  #a78bfa (violeta)     → text-accent-400
  Success: #10b981 (verde)       → text-success
  Warning: #f59e0b (amarillo)    → text-warning
  Danger:  #ef4444 (rojo)        → text-danger
  XP:      #fbbf24 (dorado)      → text-xp
  Streak:  #f97316 (naranja)     → text-streak

Colores por area del EGEL:
  Area 1 (Analisis):    #38bdf8 → text-area1
  Area 2 (Diseno):      #a78bfa → text-area2
  Area 3 (Desarrollo):  #34d399 → text-area3
  Area 4 (Gestion):     #fbbf24 → text-area4

Fondos:
  Base:    #0a0f1e  → bg-bg-base
  Surface: #111827  → bg-bg-surface  (cards)
  Raised:  #1f2937  → bg-bg-raised   (modales)
  Border:  #374151  → border-bg-border

Inspiracion: Duolingo (gamificacion) + Linear (dark UI) + Vercel (cards)
```

---

## CONVENCIONES DE CODIGO

- TypeScript **strict mode** — no `any`, no `@ts-ignore` sin explicacion
- Componentes en **PascalCase**, archivos en **kebab-case**
- Server Actions: verbos descriptivos → `startQuizSession`, `submitAnswer`
- Comentarios en **espanol** — explican el "por que", no el "que"
- Textos de la UI en **espanol** — la app es para Mexico
- Usar `cn()` de `@/lib/utils/cn` para clases condicionales de Tailwind
- Iconos: siempre `lucide-react`
- NO inline styles — solo Tailwind
- `data-testid` en elementos interactivos principales

---

## CUANDO CREAR MIGRATIONS

Crear migration nueva SIEMPRE que:
- Agregar tabla, columna, o index
- Modificar politicas RLS
- NUNCA modificar migrations existentes

```bash
supabase migration new nombre_descriptivo
# Editar el .sql generado
npm run db:push
npm run db:types   # OBLIGATORIO despues de cada migration
```

---

## TESTS — QUE TESTEAR

Unit tests (Vitest) OBLIGATORIOS para:
- `modules/quiz/lib/scoring.ts`
- `modules/quiz/lib/shuffle.ts`
- `modules/gamification/lib/xp.ts`
- `modules/gamification/lib/streaks.ts`
- `modules/gamification/lib/achievements.ts`
- Todos los Zod schemas

E2E tests (Playwright) para flujos criticos:
- Registro → onboarding → primer quiz
- Simulacro completo
- Admin: crear pregunta → aparece en quiz

---

## REFERENCIAS

Los docs completos del proyecto estan en:
`../05-Herramientas/` (carpeta hermana)

- `PRD-SIMULADOR-EGEL-WEB.md`        → Especificacion del producto
- `ARQUITECTURA-Y-WORKSPACE.md`      → Schema DB completo, patrones
- `FUNCIONALIDADES-SAAS-EGEL.html`   → Todas las pantallas y features
- `TASKS-CLAUDE-CODE.md`             → 27 tasks ordenadas para construir el proyecto
- `DESIGN-SYSTEM.md`                 → Tokens Tailwind, animaciones, componentes
