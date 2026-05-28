# EGELPro

[![CI](https://github.com/USER/egel-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/USER/egel-pro/actions/workflows/ci.yml)
[![Deploy](https://github.com/USER/egel-pro/actions/workflows/deploy.yml/badge.svg)](https://github.com/USER/egel-pro/actions/workflows/deploy.yml)

Simulador web para preparar el EGEL Plus ISOFT — Next.js 14 + Supabase + Tailwind.

## Inicio rapido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus keys de Supabase

# 3. Iniciar DB local
supabase start
npm run db:push
npm run db:types

# 4. Iniciar dev server
npm run dev
```

## Claude Code

```bash
# Abrir Claude Code en este directorio
claude

# Pegar el primer prompt del archivo PRIMER-PROMPT.md
```

## Comandos utiles

```bash
npm run dev           # Dev server
npm run test          # Unit tests
npm run test:e2e      # Playwright E2E
npm run typecheck     # TypeScript check
npm run lint          # ESLint
npm run db:push       # Aplicar migrations
npm run db:types      # Regenerar tipos DB
npm run email:dev     # Preview React Email templates
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): typecheck + lint + unit tests + build en cada push/PR. Job E2E con Playwright (necesita secrets de Supabase) corre en push o PR no-draft.
- **Deploy** (`.github/workflows/deploy.yml`): push a `main` -> deploy automatico a Vercel prod.

Secrets requeridos en GitHub repo (Settings -> Secrets and variables -> Actions):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VERCEL_TOKEN` (https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` (obtener con `vercel link`)

## Documentacion

Ver carpeta `../05-Herramientas/` para PRD, arquitectura, features y tasks.
