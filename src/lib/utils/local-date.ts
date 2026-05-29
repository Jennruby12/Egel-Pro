/**
 * Devuelve YYYY-MM-DD calculado con la fecha LOCAL del navegador,
 * NO UTC. Critico para racha estilo TikTok: el dia cambia a las
 * 00:00 hora local del usuario.
 *
 * Para uso server-side, recibe la fecha local (string) calculada
 * en el cliente y la valida.
 */
export function toLocalDate(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Calcula los milisegundos hasta las 00:00 hora local del dia siguiente.
 * Util para countdowns de racha.
 */
export function msUntilLocalMidnight(now: Date = new Date()): number {
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0,
  )
  return tomorrow.getTime() - now.getTime()
}

/**
 * Formatea milisegundos como "HH:MM:SS" o "Xh YYm" si >= 1h.
 */
export function formatCountdown(ms: number): string {
  if (ms < 0) ms = 0
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Valida que un string sea YYYY-MM-DD razonable (entre 2020 y 2100).
 * Defensivo contra fechas manipuladas por el cliente.
 */
export function isValidLocalDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const [y, m, d] = s.split('-').map(Number) as [number, number, number]
  if (y < 2020 || y > 2100) return false
  if (m < 1 || m > 12) return false
  if (d < 1 || d > 31) return false
  return true
}
