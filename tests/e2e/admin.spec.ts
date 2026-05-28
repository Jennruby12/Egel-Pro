import { test, expect } from './fixtures/auth'

test.describe('Admin routes (smoke)', () => {
  test('/admin redirige a login sin auth', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/admin/questions redirige a login sin auth', async ({ page }) => {
    await page.goto('/admin/questions')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/admin/questions/new redirige a login sin auth', async ({ page }) => {
    await page.goto('/admin/questions/new')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/admin/questions/import redirige a login sin auth', async ({ page }) => {
    await page.goto('/admin/questions/import')
    await expect(page).toHaveURL(/\/login/)
  })

  test.skip('TODO: usuario student no admin recibe redirect a /dashboard al visitar /admin', async () => {
    // Requiere setup de usuario student en Supabase test instance
  })

  test.skip('TODO: admin puede crear pregunta', async () => {
    // Requiere usuario admin pre-seedado
  })
})
