import { test as base, type Page } from '@playwright/test'

/**
 * Auth helpers para tests E2E. Cada test que necesita auth crea un usuario
 * nuevo (email unico) o reusa uno via fixtures.
 *
 * En CI debe estar la confirmacion de email DESACTIVADA en Supabase
 * (Settings -> Auth -> Email -> "Confirm email" off), o usar Inbucket en local.
 */

export type TestUser = {
  email: string
  password: string
  fullName: string
}

export function makeTestUser(label = 'tester'): TestUser {
  const ts = Date.now()
  return {
    email: `${label}-${ts}-${Math.floor(Math.random() * 10_000)}@egelpro-test.local`,
    password: 'TestPass123!',
    fullName: `Test ${label} ${ts}`,
  }
}

export async function signUpViaUI(page: Page, user: TestUser): Promise<void> {
  await page.goto('/register')
  await page.getByLabel('Nombre completo').fill(user.fullName)
  await page.getByLabel('Email').fill(user.email)
  await page.getByLabel('Contrasena', { exact: true }).fill(user.password)
  await page.getByLabel('Confirmar contrasena').fill(user.password)
  // El checkbox "Acepto los terminos" — usar label
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Crear cuenta gratis' }).click()
}

export async function signInViaUI(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login')
  await page.getByLabel('Email').fill(user.email)
  await page.getByLabel('Contrasena').fill(user.password)
  await page.getByRole('button', { name: 'Iniciar sesion' }).click()
}

/**
 * Fixture base extendido — puede crecer con session sharing via storageState
 * cuando los tests crezcan.
 */
export const test = base.extend({})
export { expect } from '@playwright/test'
