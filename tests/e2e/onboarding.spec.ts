import { test, expect } from './fixtures/auth'

test.describe('Onboarding (smoke)', () => {
  test('/onboarding redirige a login sin auth', async ({ page }) => {
    await page.goto('/onboarding')
    await expect(page).toHaveURL(/\/login/)
  })

  test.skip('TODO: nuevo user es redirigido a /onboarding desde /dashboard', async () => {
    // - signUp con usuario fresco (no onboarded)
    // - go a /dashboard
    // - debe redirigir a /onboarding
    // - completar los 5 pasos
    // - debe terminar en /dashboard con onboarding_completed=true
  })
})
