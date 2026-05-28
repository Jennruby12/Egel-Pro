'use client'

import confetti from 'canvas-confetti'

type Preset = 'levelUp' | 'perfectScore' | 'achievement' | 'streakMilestone' | 'celebration'

const AURORA_COLORS = ['#5B7CFF', '#B66BFF', '#FF6B9D', '#FFD700', '#6BE5FF']

export function fireConfetti(preset: Preset = 'celebration'): void {
  if (typeof window === 'undefined') return

  switch (preset) {
    case 'levelUp':
      // Burst grande + cascada lateral
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: AURORA_COLORS,
      })
      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors: AURORA_COLORS })
        confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors: AURORA_COLORS })
      }, 200)
      break

    case 'perfectScore':
      // Fireworks pattern
      const fire = (x: number) => {
        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 35,
          origin: { x, y: 0.5 },
          colors: AURORA_COLORS,
          shapes: ['star', 'circle'],
        })
      }
      fire(0.2)
      setTimeout(() => fire(0.5), 150)
      setTimeout(() => fire(0.8), 300)
      break

    case 'achievement':
      // Burst pequeño desde abajo
      confetti({
        particleCount: 50,
        spread: 60,
        startVelocity: 25,
        origin: { y: 0.7 },
        colors: AURORA_COLORS,
        shapes: ['star'],
      })
      break

    case 'streakMilestone':
      // Fire-themed colors
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF8A3D', '#FFD700', '#FF6B6B', '#FBBF24'],
        shapes: ['circle'],
      })
      break

    case 'celebration':
    default:
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: AURORA_COLORS,
      })
      break
  }
}
