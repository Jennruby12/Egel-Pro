# EGELPro

[![CI](https://github.com/Leonard-ssj/Egel-Pro/actions/workflows/ci.yml/badge.svg)](https://github.com/Leonard-ssj/Egel-Pro/actions/workflows/ci.yml)

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

- **CI** (`.github/workflows/ci.yml`): typecheck + lint + unit tests + build en cada push/PR a `main` y `dev`. El job E2E con Playwright corre **solo bajo demanda** (pestana Actions -> Run workflow), porque necesita un Supabase real con datos sembrados; en push/PR el webServer se cuelga.
- **Deploy**: lo maneja la **integracion Git de Vercel** (no hay workflow de deploy). Conecta el repo en Vercel -> proyecto `egel-pro` -> Settings -> Git, con branch de produccion `main`. Cada push a `main` despliega automaticamente.

Secrets opcionales en GitHub repo (Settings -> Secrets and variables -> Actions), solo si quieres que el build de CI use tu instancia de Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Documentacion

Ver carpeta `../05-Herramientas/` para PRD, arquitectura, features y tasks.
