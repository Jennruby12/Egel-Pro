/**
 * QA exhaustivo del módulo Auth + Admin contra producción.
 * Corre con: PLAYWRIGHT_BASE_URL=https://egel-pro.vercel.app npx playwright test tests/e2e/qa-auth-admin.spec.ts --workers=1
 *
 * NOTA: Apunta a prod por defecto si no se pasa env. Skip del webServer
 *       no es posible desde aqui (config global). Si webServer arranca dev,
 *       la baseURL del test fuerza prod via test.use().
 */
import { test, expect, type Page } from '@playwright/test'

const PROD_URL = 'https://egel-pro.vercel.app'

const ADMIN_EMAIL = 'admin@egelpro-test.local'
const ADMIN_PASSWORD = 'TestAdmin2026!'
const STUDENT_EMAIL = 'student@egelpro-test.local'
const STUDENT_PASSWORD = 'TestStudent2026!'
const VETERANO_EMAIL = 'veterano@egelpro-test.local'
const VETERANO_PASSWORD = 'TestVeterano2026!'

// Forzar baseURL a prod independiente de config
test.use({ baseURL: process.env.PLAYWRIGHT_BASE_URL ?? PROD_URL })

// Helper login via UI
async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contrasena').fill(password)
  await page.getByRole('button', { name: 'Iniciar sesion', exact: true }).click()
}

// Helper para limpiar sesion
async function logout(page: Page) {
  // Boton "Salir" en el header
  const out = page.getByRole('button', { name: 'Salir' })
  if (await out.isVisible().catch(() => false)) {
    await out.click()
  } else {
    await page.context().clearCookies()
  }
}

// ============================================================
// A. SMOKE PUBLICO
// ============================================================
test.describe('A. Smoke publico', () => {
  test('A1. landing renderiza hero + CTAs + aurora', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    const res = await page.goto('/')
    expect(res?.status()).toBeLessThan(400)

    // H1 con "Domina el" + EGEL Plus
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Domina el/i)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/EGEL Plus/i)

    // CTAs
    await expect(page.getByRole('link', { name: /Empezar gratis/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Iniciar sesion/i }).first()).toBeVisible()

    // AuroraBackground se renderiza (busca el container del aurora variant intense)
    const aurora = page.locator('.bg-aurora-mesh, [class*="aurora"]').first()
    await expect(aurora).toBeAttached()

    // Filtrar errores conocidos no fatales (ej. analytics)
    const fatal = errors.filter(
      (e) =>
        !/favicon/i.test(e) &&
        !/analytics/i.test(e) &&
        !/vitals/i.test(e) &&
        !/preload/i.test(e),
    )
    expect(fatal, `Errores fatales en consola landing: ${fatal.join('\n')}`).toHaveLength(0)
  })

  test('A2. /login renderiza form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contrasena')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar sesion', exact: true })).toBeVisible()
  })

  test('A3. /register renderiza todos los campos requeridos', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByLabel('Nombre completo')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contrasena', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirmar contrasena')).toBeVisible()
    await expect(page.getByLabel(/Universidad/i)).toBeVisible()
    await expect(page.getByLabel(/Fecha de examen/i)).toBeVisible()
    await expect(page.getByRole('checkbox')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Crear cuenta gratis' })).toBeVisible()
  })
})

// ============================================================
// B. LOGIN ADMIN -> /admin
// ============================================================
test.describe('B. Admin flow', () => {
  test('B1. login admin -> dashboard, sidebar muestra Admin', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
    // Sidebar tiene el link Admin
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
  })

  test('B2. navegar a /admin sin error 500 + stats con AnimatedCounter', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })

    const res = await page.goto('/admin')
    expect(res?.status(), `Status /admin = ${res?.status()}`).toBeLessThan(500)

    // Page header
    await expect(page.getByRole('heading', { name: /Panel de administracion/i })).toBeVisible()

    // 4 stat cards renderizan
    await expect(page.getByText('Preguntas', { exact: true })).toBeVisible()
    await expect(page.getByText('Guias', { exact: true })).toBeVisible()
    await expect(page.getByText('Usuarios', { exact: true })).toBeVisible()
    await expect(page.getByText(/Quizzes completados/i)).toBeVisible()

    // AnimatedCounter: al menos el de Usuarios debe tener un numero > 0
    // Tomamos el CardTitle con texto numerico tras animacion
    await page.waitForTimeout(2000) // dejar animacion correr
    const cards = page.locator('[class*="text-3xl"][class*="font-bold"]')
    const count = await cards.count()
    expect(count, 'Hay al menos 4 stat cards').toBeGreaterThanOrEqual(4)
  })

  test('B3. /admin/questions/new carga form', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
    const res = await page.goto('/admin/questions/new')
    expect(res?.status(), `Status /admin/questions/new = ${res?.status()}`).toBeLessThan(500)
    // Algun heading o boton del form
    const submitBtn = page.getByRole('button', { name: /(Crear|Guardar|Publicar)/i }).first()
    await expect(submitBtn).toBeVisible({ timeout: 10_000 })
  })

  test('B4. /admin/questions lista carga', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
    const res = await page.goto('/admin/questions')
    expect(res?.status(), `Status /admin/questions = ${res?.status()}`).toBeLessThan(500)
  })
})

// ============================================================
// C. LOGIN STUDENT NO ONBOARDED -> wizard
// ============================================================
test.describe('C. Student onboarding wizard', () => {
  test('C1. student fresco redirige a /onboarding y wizard funciona', async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD)
    // Espera redirect a onboarding
    await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20_000 })

    const url = page.url()
    if (!url.includes('/onboarding')) {
      // Si el seed ya completo onboarding antes, no podemos repetir el flow
      test.skip(true, `Student ya esta onboarded (URL=${url}). Re-seed la DB.`)
      return
    }

    // WelcomeStep
    await expect(page.getByRole('heading', { name: /Bienvenido a EGEL/i })).toBeVisible()
    await page.getByRole('button', { name: /Comenzar/i }).click()

    // ExamDateStep
    await expect(page.getByRole('heading', { name: /Cuando es tu/i })).toBeVisible()
    await page.locator('input[type="date"]').fill('2026-10-15')
    await page.getByRole('button', { name: /Continuar/i }).click()

    // DiagnosticStep: responder 5 preguntas (siempre seleccionar la opcion A)
    await expect(page.getByRole('heading', { name: /Diagnostico/i })).toBeVisible()
    for (let i = 0; i < 5; i++) {
      // Boton opcion 'a' tiene un span con la letra "a"
      const optionA = page.locator('button:has(span:text-is("a"))').first()
      await optionA.click()
      // Siguiente o Continuar
      const nextBtn = page.getByRole('button', { name: /(Siguiente|Continuar)/i })
      await nextBtn.click()
      await page.waitForTimeout(400)
    }

    // GoalStep
    await expect(page.getByRole('heading', { name: /Cual es tu/i })).toBeVisible()
    // Sobresaliente esta seleccionado por default, click Continuar
    await page.getByRole('button', { name: /Continuar/i }).click()

    // SummaryStep
    await expect(page.getByRole('heading', { name: /Tu plan esta/i })).toBeVisible()
    await page.getByRole('button', { name: /Empezar a practicar/i }).click()

    // Llegamos a /dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
  })
})

// ============================================================
// D. LOGIN VETERANO -> dashboard rico
// ============================================================
test.describe('D. Veterano dashboard', () => {
  test('D1. dashboard de veterano muestra hero + stats + areas debiles', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
    })

    await loginAs(page, VETERANO_EMAIL, VETERANO_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })

    // Hero "Hola,"
    await expect(page.getByRole('heading', { name: /Hola/i })).toBeVisible()

    // Header debe tener Nivel y XP
    await expect(page.getByText(/Nv \d/i)).toBeVisible()

    // El dashboard debe cargar sin errores fatales
    await page.waitForTimeout(2500)
    const fatal = errors.filter(
      (e) =>
        !/favicon/i.test(e) &&
        !/analytics/i.test(e) &&
        !/vitals/i.test(e) &&
        !/preload/i.test(e) &&
        !/Failed to load resource.*manifest/i.test(e),
    )
    expect(fatal, `Errores en dashboard veterano:\n${fatal.join('\n')}`).toHaveLength(0)
  })

  test('D2. veterano puede navegar a Logros y Progreso', async ({ page }) => {
    await loginAs(page, VETERANO_EMAIL, VETERANO_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })

    // Achievements
    const resA = await page.goto('/achievements')
    expect(resA?.status(), `Status /achievements = ${resA?.status()}`).toBeLessThan(500)

    // Progress
    const resP = await page.goto('/progress')
    expect(resP?.status(), `Status /progress = ${resP?.status()}`).toBeLessThan(500)
  })
})

// ============================================================
// E. THEME TOGGLE
// ============================================================
test.describe('E. Theme toggle', () => {
  test('E1. toggle aplica clase light al <html>', async ({ page }) => {
    await loginAs(page, VETERANO_EMAIL, VETERANO_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })

    // Estado inicial: verificar clase
    const initialHtml = await page.locator('html').getAttribute('class')

    // Click toggle (cualquiera de los 2 botones aria-label)
    const toggle = page.getByRole('button', { name: /(Cambiar a modo claro|Cambiar a modo oscuro)/i }).first()
    await toggle.click()
    await page.waitForTimeout(300)

    const afterToggle = await page.locator('html').getAttribute('class')
    expect(afterToggle, 'La clase del <html> cambia al hacer toggle').not.toBe(initialHtml)

    // Persistencia tras nav
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
    const afterNav = await page.locator('html').getAttribute('class')
    expect(afterNav, 'El tema persiste tras navegar').toBe(afterToggle)
  })
})

// ============================================================
// F. SEGURIDAD
// ============================================================
test.describe('F. Security', () => {
  test('F1. /admin/questions sin auth -> /login', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/admin/questions')
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })

  test('F2. student NO admin -> /admin redirige a /dashboard', async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD)
    // Esperar a que termine el login (puede ir a /dashboard u /onboarding)
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 20_000 })

    // Intentar ir a /admin
    await page.goto('/admin')
    // Debe quedar fuera de /admin
    await page.waitForLoadState('networkidle')
    const url = page.url()
    expect(url, `URL tras intentar /admin como student = ${url}`).not.toMatch(/\/admin(\/|$)/)
  })

  test('F3. quiz_session_id inexistente -> notFound o redirect manejado', async ({ page }) => {
    await loginAs(page, VETERANO_EMAIL, VETERANO_PASSWORD)
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })

    const res = await page.goto('/quiz/session/00000000-0000-0000-0000-000000000000')
    // Debe ser 404 o un redirect (no 500)
    const status = res?.status() ?? 0
    expect(status, `Status quiz inexistente = ${status}`).toBeLessThan(500)
  })

  test('F4. headers de seguridad en response principal', async ({ page }) => {
    const res = await page.goto('/')
    const headers = res?.headers() ?? {}
    // Next.js + Vercel suele setear X-Content-Type-Options al menos
    expect(headers['x-content-type-options'], 'x-content-type-options presente').toBe('nosniff')
    // x-frame-options o CSP frame-ancestors
    const hasFrameProtection = !!headers['x-frame-options'] || /frame-ancestors/i.test(headers['content-security-policy'] ?? '')
    expect(hasFrameProtection, 'Tiene proteccion contra framing').toBe(true)
  })
})
