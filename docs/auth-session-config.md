# Configuración de sesión Supabase Auth — 18 horas

## Estado actual (default Supabase)

- **JWT expiry**: 3600 segundos (1 hora). Refresh automático mientras el cookie refresh viva.
- **Refresh token**: 30 días por defecto, **reusable** (mismo token sirve varias veces).
- **Refresh token rotation**: opcionalmente activado (rota en cada uso, más seguro).

Tu app YA refresca tokens automáticamente en cada navegación gracias a `src/lib/supabase/middleware.ts`. El usuario **no se desloguea cada hora** — el navegador refresca silenciosamente.

## Lo que el usuario percibe

- Mientras visite la app dentro de los 30 días, **nunca pierde la sesión**.
- Si no entra por más de 30 días → debe loguearse de nuevo.

## Si quieres extender a 18 horas el JWT (menos refresh requests, mejor para mobile flaky)

**Pasos manuales en Supabase Dashboard** (no se puede vía SQL ni MCP — es config del servicio GoTrue):

1. Abrir https://supabase.com/dashboard/project/fcissioekvahzklhvsnd/auth/providers
2. Ir a **Sessions** → **Settings**
3. En **JWT expiry limit**, cambiar de `3600` a `64800` (= 18 horas)
4. En **Refresh token reuse interval**, dejar default `10 segundos`
5. En **Refresh token rotation**, activar (recomendado para seguridad)
6. Click **Save**

**Efecto:** los tokens JWT viven 18h. Reduce ~94% las llamadas de refresh. Sigue siendo seguro porque:
- Si un token es robado, expira en 18h máx (vs 1h antes).
- Refresh rotation mitiga el riesgo si activas.

## Logout automático por inactividad (opcional, NO implementado por default)

Supabase NO tiene logout por inactividad nativo. Si quieres "logout automático tras 18h sin actividad":

```ts
// src/components/shared/IdleLogout.tsx
'use client'
import { useEffect } from 'react'
import { signOut } from '@/modules/auth/actions'

const IDLE_MS = 18 * 60 * 60 * 1000 // 18 horas
const KEY = 'egelpro-last-activity'

export function IdleLogout() {
  useEffect(() => {
    const bump = () => localStorage.setItem(KEY, String(Date.now()))
    bump()
    const events = ['mousemove', 'keydown', 'touchstart', 'visibilitychange']
    events.forEach((e) => window.addEventListener(e, bump))

    const interval = setInterval(() => {
      const last = Number(localStorage.getItem(KEY) ?? Date.now())
      if (Date.now() - last > IDLE_MS) {
        signOut()
      }
    }, 60_000)

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump))
      clearInterval(interval)
    }
  }, [])
  return null
}
```

Y agregarlo al `DashboardLayout`. **Pero**: para una app educativa esto suele molestar más que ayudar. Recomendación: solo subir JWT expiry a 18h en Dashboard y NO agregar logout por inactividad.
