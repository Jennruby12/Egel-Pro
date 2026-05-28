import { test, expect } from './fixtures/auth'

test.describe('Auth pages', () => {
  test('landing page renders and links to /login + /register', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('EGEL')
    await expect(page.getByRole('link', { name: 'Iniciar sesion' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Empezar gratis' })).toBeVisible()
  })

  test('/login renders form fields and link to /register', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading')).toContainText('Bienvenido de vuelta')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contrasena')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar sesion' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Registrate' })).toBeVisible()
  })

  test('/register renders all required fields', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading')).toContainText('Crea tu cuenta')
    await expect(page.getByLabel('Nombre completo')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contrasena', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirmar contrasena')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Crear cuenta gratis' })).toBeVisible()
  })

  test('/forgot-password renders form', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: /recuperacion/i })).toBeVisible()
  })

  test('protected route redirects to /login when not authenticated', async ({ page }) => {
    const response = await page.goto('/dashboard')
    // Middleware redirige a /login con ?redirectTo=/dashboard
    await expect(page).toHaveURL(/\/login/)
    expect(response?.status()).toBeLessThan(500)
  })
})
