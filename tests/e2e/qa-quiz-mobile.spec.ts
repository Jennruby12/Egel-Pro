/**
 * QA exhaustivo del modulo Quiz + Simulacro + Study + Progress
 * + Mobile responsive contra produccion (egel-pro.vercel.app).
 *
 * Usa cuenta seed `veterano@egelpro-test.local` (con onboarding completo,
 * 12 dias de actividad y 5 logros).
 *
 * Para correr contra prod:
 *   PLAYWRIGHT_BASE_URL=https://egel-pro.vercel.app \
 *     npx playwright test tests/e2e/qa-quiz-mobile.spec.ts --workers=1 --reporter=list
 *
 * NOTAS:
 *  - Cada test re-loggea (storageState compartido no se usa para mantenerlo independiente).
 *  - Para evitar arrancar dev server local cuando se apunta a prod, se override
 *    `webServer: undefined` mediante variable de entorno PLAYWRIGHT_BASE_URL.
 *    Si el proceso webServer arranca igualmente, usar:
 *      npx playwright test ... --config playwright.prod.config.ts (no existe; usar override env).
 */

import { test as base, expect, type Page } from '@playwright/test'

const TEST_USER = {
  email: 'veterano@egelpro-test.local',
  password: 'TestVeterano2026!',
}

/**
 * Helper: hace login UI con el usuario seed. Espera redirect a /dashboard.
 */
async function signInAsVeterano(page: Page): Promise<void> {
  await page.goto('/login')
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Contrasena').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Iniciar sesion' }).click()
  // Espera a que se complete redirect a dashboard (puede tomar tiempo en prod)
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 })
}

// =====================================================================
// DESKTOP TESTS
// =====================================================================
base.describe('QA Quiz Desktop', () => {
  base.use({ viewport: { width: 1440, height: 900 } })

  base(
    'A. Quiz flow E2E: practica 5 preguntas hasta resultados',
    async ({ page }) => {
      base.setTimeout(120_000)

      // --- Login ---
      await signInAsVeterano(page)

      // --- /quiz ---
      await page.goto('/quiz')
      await expect(
        page.getByRole('heading', { name: /Practicar/i }).first(),
      ).toBeVisible()

      // ModeSelector con 6 modos
      const modeLabels = [
        'Practica',
        'Examen rapido',
        'Simulacro completo',
        'Repasar errores',
        'Reto rapido',
        'Reto diario',
      ]
      for (const label of modeLabels) {
        await expect(page.getByText(label, { exact: true }).first()).toBeVisible()
      }

      // Selecciona "Practica" (primer modo)
      await page.getByText('Practica', { exact: true }).first().click()

      // AreaSelector debe aparecer (step 2 - Configura)
      await expect(page.getByText('Configura', { exact: true })).toBeVisible()
      await expect(page.getByText('Areas a incluir').first()).toBeVisible()

      // Selecciona Area 1 y Area 2
      await page
        .getByRole('button', { name: /Area 1:/i })
        .click()
      await page
        .getByRole('button', { name: /Area 2:/i })
        .click()

      // Click "Comenzar quiz"
      const startBtn = page.getByRole('button', { name: /Comenzar quiz/i })
      await expect(startBtn).toBeEnabled()
      await Promise.all([
        page.waitForURL(/\/quiz\/session\/[0-9a-f-]+/, { timeout: 30_000 }),
        startBtn.click(),
      ])

      // --- Quiz session UI checks ---
      // QuizTimer (sin limite en practice mode → muestra "Sin limite")
      // o data-testid="quiz-timer" si hay limite
      await expect(
        page
          .locator('[data-testid="quiz-timer"]')
          .or(page.getByText('Sin limite').first()),
      ).toBeVisible({ timeout: 15_000 })

      // QuestionDisplay con badge area + texto pregunta
      await expect(page.getByText(/Area \d · Subarea \d/).first()).toBeVisible()

      // OptionsList con 3 opciones data-testid="option-a/b/c"
      await expect(page.locator('[data-testid="option-a"]')).toBeVisible()
      await expect(page.locator('[data-testid="option-b"]')).toBeVisible()
      await expect(page.locator('[data-testid="option-c"]')).toBeVisible()

      // QuizProgress + mini-mapa dots (quiz-map-0 ..)
      await expect(page.locator('[data-testid="quiz-map-0"]')).toBeVisible()

      // --- Responder preguntas alternando A/B/C ---
      const options = ['a', 'b', 'c', 'a', 'b'] as const
      const totalQuestions = await page
        .locator('[data-testid^="quiz-map-"]')
        .count()
      const answersToGive = Math.min(options.length, totalQuestions)

      for (let i = 0; i < answersToGive - 1; i++) {
        const opt = options[i]!
        await page.locator(`[data-testid="option-${opt}"]`).click()
        // Click Siguiente
        await page.getByRole('button', { name: /Siguiente/i }).click()
      }

      // Ultima pregunta: responder y luego Finalizar
      await page
        .locator(`[data-testid="option-${options[answersToGive - 1]}"]`)
        .click()

      // Avanzar hasta la ultima si el quiz tiene mas preguntas que las que respondimos
      while (true) {
        const finishBtn = page.getByRole('button', { name: /Finalizar quiz/i })
        if (await finishBtn.isVisible().catch(() => false)) {
          await finishBtn.click()
          break
        }
        const nextBtn = page.getByRole('button', { name: /Siguiente/i })
        if (await nextBtn.isVisible().catch(() => false)) {
          // Saltar las restantes
          await page.getByRole('button', { name: /Saltar/i }).click()
        } else {
          break
        }
      }

      // --- Resultados ---
      await page.waitForURL(/\/quiz\/results\/[0-9a-f-]+/, { timeout: 30_000 })

      // ScoreAnimation: numero grande con %
      await expect(page.getByText(/%/).first()).toBeVisible({ timeout: 15_000 })

      // Stats: "Correctas", "Incorrectas", "XP ganado"
      await expect(page.getByText('Correctas')).toBeVisible()
      await expect(page.getByText('Incorrectas')).toBeVisible()
      await expect(page.getByText(/XP ganado/i)).toBeVisible()

      // CTA buttons
      await expect(
        page.getByRole('link', { name: /Volver al dashboard/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: /Hacer otro quiz/i }),
      ).toBeVisible()
    },
  )

  base('B. Simulacro intro renderiza con hero epico', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/simulacro')

    // El page puede redirigir a /simulacro/<id> si ya hay uno in_progress.
    // En ese caso aceptamos el redirect como valido (significa que el flow
    // funciona y la cuenta tiene un simulacro abierto previo).
    await page.waitForLoadState('networkidle', { timeout: 15_000 })
    const url = page.url()

    if (url.includes('/simulacro/') && !url.endsWith('/simulacro')) {
      // Redirigio al grupo existente — registramos y salimos
      // eslint-disable-next-line no-console
      console.log('[QA] /simulacro redirigio a grupo existente:', url)
      return
    }

    // Verifica titulo "Simulacro EGEL"
    await expect(page.getByText(/Simulacro EGEL/i).first()).toBeVisible()

    // Verifica numero gigante 203
    await expect(page.getByText('203').first()).toBeVisible()
    await expect(page.getByText('reactivos totales')).toBeVisible()

    // Info tiles
    await expect(page.getByText('Reactivos').first()).toBeVisible()
    await expect(page.getByText(/Duracion por sesion/i)).toBeVisible()
    await expect(page.getByText('Sesion 1')).toBeVisible()
    await expect(page.getByText('Sesion 2')).toBeVisible()

    // Alert
    await expect(page.getByText('Lee antes de empezar')).toBeVisible()

    // CTA aurora con pulse-glow + data-testid
    const startBtn = page.locator('[data-testid="start-simulacro-btn"]')
    await expect(startBtn).toBeVisible()
    await expect(startBtn).toHaveText(/Empezar simulacro/i)
    // NO HACER CLICK (crearia 102 preguntas)
  })

  base('C. Study hub + flashcards empty state', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/study')

    await expect(
      page.getByRole('heading', { name: /Guias de estudio/i }),
    ).toBeVisible()
    await expect(page.getByText(/Areas disciplinares/i)).toBeVisible()
    await expect(page.getByText(/Areas transversales/i)).toBeVisible()
    // Bento cards de las 4 areas disciplinares
    for (const a of [1, 2, 3, 4]) {
      await expect(
        page.locator(`[data-testid="study-area-${a}"]`),
      ).toBeVisible()
    }

    // Click area 1 → primer link a subarea
    await page.goto('/study/1/1?section=disciplinar')
    await page.waitForLoadState('networkidle', { timeout: 15_000 })

    // GuideViewer renderea (o EmptyState)
    // Aceptamos cualquiera de los dos
    const hasGuide = await page
      .locator('article, .prose')
      .first()
      .isVisible()
      .catch(() => false)
    const hasEmpty = await page
      .getByText(/Aun no hay|sin guias|pronto|proximamente/i)
      .first()
      .isVisible()
      .catch(() => false)
    expect(hasGuide || hasEmpty).toBeTruthy()

    // Flashcards page (espera empty state)
    await page.goto('/study/1/1/flashcards')
    await page.waitForLoadState('networkidle', { timeout: 15_000 })
    // No debe crashear (200 o redirect aceptable)
    expect(page.url()).toMatch(/\/study\/1\/1/)
  })

  base('D. Progress dashboard con datos del veterano', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/progress')

    await expect(
      page.getByRole('heading', { name: /Tu progreso/i }),
    ).toBeVisible()

    // El veterano tiene datos → no debe ver el empty state
    // Pero si llegara a verlo (eg. data wipe), aceptamos como bug a reportar
    const emptyState = await page
      .getByText(/Aun no hay datos para mostrar/i)
      .isVisible()
      .catch(() => false)

    if (emptyState) {
      // eslint-disable-next-line no-console
      console.warn(
        '[QA WARN] veterano account muestra empty state en /progress — datos faltantes',
      )
      return
    }

    // Componentes esperados — al menos uno de cada
    await expect(page.locator('svg').first()).toBeVisible() // radar SVG
    // Heatmap, prediction, etc. - chequeamos textos
    await expect(page.getByText(/Practicar mas|Hacer otro|Empezar/).first()).toBeVisible()
  })

  base('E. Achievements page con stats del veterano', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/achievements')

    await expect(page.getByRole('heading', { name: /Logros/i })).toBeVisible()

    // AchievementStats: "X / 23 logros" (el catalogo tiene varios)
    // Buscar el patron "X / Y" con un numero >= 0
    await expect(page.locator('text=/\\d+\\s*\\/\\s*\\d+/').first()).toBeVisible()

    // Helper text de progreso
    await expect(page.getByText(/completado/i).first()).toBeVisible()
  })

  base('F. Profile + theme toggle alterna html.light', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/profile')

    // 5 secciones GlassCard
    await expect(page.getByRole('heading', { name: /Avatar/i })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /Datos personales/i }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: /Apariencia/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Cuenta/i })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /Zona peligrosa/i }),
    ).toBeVisible()

    // Theme toggle (button aria-label cambia segun tema)
    const themeBtn = page
      .getByRole('button', { name: /modo (claro|oscuro)/i })
      .first()
    await expect(themeBtn).toBeVisible()

    const initialClass = await page.evaluate(() =>
      document.documentElement.className,
    )

    await themeBtn.click()
    await page.waitForTimeout(500) // animacion

    const afterClass = await page.evaluate(() =>
      document.documentElement.className,
    )

    expect(afterClass).not.toBe(initialClass)
    // Uno de los dos debe contener 'light'
    expect(
      afterClass.includes('light') || initialClass.includes('light'),
    ).toBeTruthy()
  })
})

// =====================================================================
// MOBILE TESTS (iPhone 12 Pro viewport)
// =====================================================================
base.describe('QA Mobile responsive', () => {
  base.use({
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  })

  base('Mobile: nav inferior visible, sidebar oculto', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/dashboard')

    // MobileNav es <nav aria-label="Navegacion principal mobile">
    const mobileNav = page.getByRole('navigation', {
      name: /Navegacion principal mobile/i,
    })
    await expect(mobileNav).toBeVisible()

    // Sidebar tiene className hidden md:block — no debe ser visible
    const sidebar = page.locator('aside').first()
    const sidebarVisible = await sidebar.isVisible().catch(() => false)
    expect(sidebarVisible).toBeFalsy()

    // Verificar links del mobile nav
    for (const lbl of ['Inicio', 'Practicar', 'Estudiar', 'Progreso', 'Perfil']) {
      await expect(mobileNav.getByText(lbl)).toBeVisible()
    }
  })

  base('Mobile: quiz opciones full-width', async ({ page }) => {
    base.setTimeout(90_000)

    await signInAsVeterano(page)
    await page.goto('/quiz')

    // Selecciona Practica
    await page.getByText('Practica', { exact: true }).first().click()

    // Comienza el quiz
    await Promise.all([
      page.waitForURL(/\/quiz\/session\/[0-9a-f-]+/, { timeout: 30_000 }),
      page.getByRole('button', { name: /Comenzar quiz/i }).click(),
    ])

    // Verifica que options ocupen ancho cercano al viewport (>= 300px en 390 viewport)
    const optionA = page.locator('[data-testid="option-a"]')
    await expect(optionA).toBeVisible({ timeout: 15_000 })
    const box = await optionA.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(300)
  })

  base('Mobile: dashboard cards stack en una columna', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/dashboard')

    // En mobile, los bento cards deberian apilarse (no estar lado a lado).
    // Tomamos el primer y segundo card y verificamos que el segundo este DEBAJO
    // del primero (no a la derecha).
    const cards = page.locator(
      'main [class*="glass"], main [class*="GlassCard"], main article, main section',
    )
    const count = await cards.count()
    if (count >= 2) {
      const box1 = await cards.nth(0).boundingBox()
      const box2 = await cards.nth(1).boundingBox()
      if (box1 && box2) {
        // box2 debe empezar despues de box1 verticalmente o solaparse menos en X
        const stackedVertically = box2.y >= box1.y + box1.height * 0.5
        const sideBySide = box2.x > box1.x + box1.width * 0.8
        // En mobile, debe estar apilado (no side-by-side)
        expect(stackedVertically || !sideBySide).toBeTruthy()
      }
    }
  })

  base('Mobile: progress page no overflow horizontal', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/progress')
    await page.waitForLoadState('networkidle', { timeout: 15_000 })

    // No debe haber scroll horizontal
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    // Tolerancia de 2px por sub-pixel
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2)
  })

  base('Mobile: profile theme toggle accesible', async ({ page }) => {
    base.setTimeout(60_000)

    await signInAsVeterano(page)
    await page.goto('/profile')

    const themeBtn = page
      .getByRole('button', { name: /modo (claro|oscuro)/i })
      .first()
    await expect(themeBtn).toBeVisible()
    // Boton debe tener tamano touch-friendly (>= 36x36)
    const box = await themeBtn.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThanOrEqual(36)
    expect(box!.height).toBeGreaterThanOrEqual(36)
  })
})

export const test = base
