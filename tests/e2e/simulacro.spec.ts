import { test, expect } from './fixtures/auth'

test.describe('Simulacro (smoke)', () => {
  test('/simulacro redirige a login sin auth', async ({ page }) => {
    await page.goto('/simulacro')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/simulacro/:groupId redirige a login sin auth', async ({ page }) => {
    await page.goto('/simulacro/00000000-0000-0000-0000-000000000000')
    await expect(page).toHaveURL(/\/login/)
  })

  // El flujo completo de simulacro (203 preguntas, 2 sesiones de 4.5h) no es
  // viable en CI. Estos smoke tests verifican que las rutas existan y la
  // proteccion de auth funcione.
  test.skip('TODO: usuario auth puede ver pantalla intro de simulacro', async () => {
    // - signIn como user pre-seedado
    // - go a /simulacro
    // - assert SimulacroIntro renderea
  })
})
