import { defineConfig, devices } from '@playwright/test'

/**
 * Override config para correr el QA suite contra produccion.
 * NO arranca dev server local — apunta directo a la URL en PLAYWRIGHT_BASE_URL
 * (o default a egel-pro.vercel.app).
 *
 * Uso:
 *   npx playwright test --config tests/e2e/playwright.prod.config.ts \
 *     tests/e2e/qa-quiz-mobile.spec.ts --reporter=list
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 90_000,
  reporter: 'list',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://egel-pro.vercel.app',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // NO webServer — apunta a la URL remota
})
