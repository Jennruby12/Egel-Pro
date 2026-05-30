# Sentry error tracking — pasos para activar

Sentry queda OPT-IN. Cuando quieras activarlo:

## 1. Crear cuenta y proyecto

1. https://sentry.io/signup/ (gratis, 5K errors/mes)
2. New Project → Next.js
3. Copia el DSN (formato `https://xxx@xxx.ingest.sentry.io/xxx`)

## 2. Instalar SDK

```bash
cd c:/Users/leona/EGEL/egel-pro
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

El wizard te genera automáticamente:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- Actualiza `next.config.mjs` con `withSentryConfig`
- Crea `.sentryclirc` (NO commitear — agregar a .gitignore)

## 3. Variables de entorno

En `.env.local` y Vercel:
```
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=...  (para uploads de source maps en build)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

## 4. Verificar

```bash
npm run build  # debe pasar sin errores
```

Abre la app, fuerza un error desde DevTools console:
```js
throw new Error('Test Sentry')
```

El error debe aparecer en https://sentry.io/issues/ en <30 segundos.

## Costo

- Free tier: 5K errors/mes, 10K performance units, 50 session replays
- Suficiente para EGELPro hasta ~500 DAU activos
- Si excedes: $26/mes plan Team

## Por qué NO lo activé ya

- Requiere `npm install` (~5 MB) → cambia `package-lock.json`
- Requiere cuenta Sentry y DSN previos
- Bundle adicional ~100 KB gzipped en cliente

Cuando estés listo: corre los 4 comandos arriba y deploy. Te toma 10 minutos.
