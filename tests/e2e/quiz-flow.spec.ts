import { test, expect } from './fixtures/auth'

test.describe('Quiz flow (smoke)', () => {
  test('/quiz redirige a login sin auth', async ({ page }) => {
    await page.goto('/quiz')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/quiz/session/:id redirige a login sin auth', async ({ page }) => {
    await page.goto('/quiz/session/00000000-0000-0000-0000-000000000000')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/quiz/results/:id redirige a login sin auth', async ({ page }) => {
    await page.goto('/quiz/results/00000000-0000-0000-0000-000000000000')
    await expect(page).toHaveURL(/\/login/)
  })

  // Test deep del flujo de quiz pendiente: requiere usuario seed con preguntas
  // pre-cargadas y email confirm disabled en Supabase. Lo dejamos como
  // followup cuando exista un Supabase test instance.
  test.skip('TODO: completar quiz e2e completo con usuario seed', async () => {
    // - signUp via fixture
    // - completeOnboarding
    // - go to /quiz
    // - select practice mode
    // - answer 5 questions
    // - assert results page shows score
  })
})
