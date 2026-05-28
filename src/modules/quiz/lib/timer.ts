/**
 * Utilidades de tiempo para el motor de quiz.
 * Maneja conversion segundos↔legible, calculo de tiempo restante,
 * y deteccion de timeouts.
 */

export type TimeBreakdown = {
  hours: number
  minutes: number
  seconds: number
}

/**
 * Convierte segundos a {h, m, s}.
 */
export function breakdownSeconds(totalSeconds: number): TimeBreakdown {
  const s = Math.max(0, Math.floor(totalSeconds))
  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

/**
 * Formatea segundos a string legible.
 * - >= 1 hora: "H:MM:SS"
 * - < 1 hora:  "M:SS"
 *
 * Ejemplo:
 *   formatTime(75)      → "1:15"
 *   formatTime(3725)    → "1:02:05"
 *   formatTime(0)       → "0:00"
 *   formatTime(-10)     → "0:00"
 */
export function formatTime(seconds: number): string {
  const { hours, minutes, seconds: secs } = breakdownSeconds(seconds)
  const ss = secs.toString().padStart(2, '0')
  if (hours > 0) {
    const mm = minutes.toString().padStart(2, '0')
    return `${hours}:${mm}:${ss}`
  }
  return `${minutes}:${ss}`
}

/**
 * Formato corto/compacto para badges:
 *   formatTimeCompact(75)    → "1m 15s"
 *   formatTimeCompact(3725)  → "1h 2m"
 *   formatTimeCompact(45)    → "45s"
 */
export function formatTimeCompact(seconds: number): string {
  const { hours, minutes, seconds: secs } = breakdownSeconds(seconds)
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

/**
 * Calcula segundos restantes dado un inicio y un limite.
 * Nunca retorna negativo (clamp a 0).
 */
export function calculateTimeRemaining(
  startedAt: Date | string,
  timeLimitSeconds: number,
  now: Date = new Date(),
): number {
  const start = typeof startedAt === 'string' ? new Date(startedAt) : startedAt
  const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000)
  return Math.max(0, timeLimitSeconds - elapsed)
}

/**
 * Calcula segundos transcurridos. Nunca negativo.
 */
export function calculateTimeElapsed(
  startedAt: Date | string,
  now: Date = new Date(),
): number {
  const start = typeof startedAt === 'string' ? new Date(startedAt) : startedAt
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000))
}

/**
 * True si ya se acabo el tiempo.
 */
export function isTimeUp(
  startedAt: Date | string,
  timeLimitSeconds: number,
  now: Date = new Date(),
): boolean {
  return calculateTimeRemaining(startedAt, timeLimitSeconds, now) === 0
}

/**
 * Para warnings visuales: retorna 'critical' | 'warning' | 'safe' segun
 * que tan cerca esta del limite.
 *   - critical: <= 10% del tiempo restante O < 60 segundos
 *   - warning:  <= 25% del tiempo restante
 *   - safe:     resto
 */
export type TimeUrgency = 'critical' | 'warning' | 'safe'

export function getTimeUrgency(
  remainingSeconds: number,
  totalSeconds: number,
): TimeUrgency {
  if (totalSeconds <= 0) return 'safe'
  const percentLeft = remainingSeconds / totalSeconds
  if (percentLeft <= 0.1 || remainingSeconds < 60) return 'critical'
  if (percentLeft <= 0.25) return 'warning'
  return 'safe'
}
