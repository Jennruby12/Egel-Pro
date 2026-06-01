# GitHub setup — secrets para CI/CD automatico

El repositorio ya esta en https://github.com/Leonard-ssj/Egel-Pro con `main` y `dev`. Los workflows en `.github/workflows/` (ci.yml + deploy.yml) corren automaticamente con cada push, pero necesitan estos **6 secrets** configurados en GitHub Settings → Secrets and variables → Actions.

## Pasos (10 minutos)

### 1. Autenticarte con gh CLI

```bash
gh auth login
# Elige: GitHub.com -> HTTPS -> Login with browser
```

### 2. Correr el script `scripts/setup-github-secrets.sh`

```bash
cd c:/Users/leona/EGEL/egel-pro
bash scripts/setup-github-secrets.sh
```

El script lee tu `.env.local`, extrae los valores necesarios y los publica como secrets del repo.

### 3. (Opcional) Configurarlo manual via UI

Ve a https://github.com/Leonard-ssj/Egel-Pro/settings/secrets/actions y agrega:

| Secret | Valor (de .env.local) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fcissioekvahzklhvsnd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key publica) |
| `SUPABASE_SERVICE_ROLE_KEY` | (service role — solo para E2E + cron) |
| `VERCEL_TOKEN` | (de https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | (de `.vercel/project.json` tras `vercel link`) |
| `VERCEL_PROJECT_ID` | (de `.vercel/project.json`) |

## Branches

- **`main`** → auto-deploys a producción Vercel en cada push (`.github/workflows/deploy.yml`)
- **`dev`** → corre CI completo (typecheck, lint, test, build, E2E) pero NO deploy

Flujo recomendado:
```bash
# Trabajo diario en dev
git checkout dev
# ... cambios ...
git commit -m "feat: ..."
git push origin dev          # CI corre

# Cuando esta estable, merge a main
git checkout main
git merge dev
git push origin main         # CI + auto-deploy production
```

## Vercel ↔ GitHub integration

Vercel ya tiene el repo conectado por commits previos. Para confirmar:
1. Abre https://vercel.com/leonardoalonsoaldana-2662s-projects/egel-pro/settings/git
2. Verifica que el connected repo sea `Leonard-ssj/Egel-Pro`
3. Si no, "Connect Git Repository" → autoriza GitHub → elige el repo

Con eso, cada push a `main` Vercel hace su propio deploy (independiente del workflow `deploy.yml`). Puedes desactivar uno de los dos para evitar deploys duplicados:
- Mantener el workflow + deshabilitar Vercel Git: control total desde GitHub Actions
- Mantener Vercel Git + borrar el workflow: mas simple, Vercel maneja todo

**Recomendado: Vercel Git** (mas simple). Borra `.github/workflows/deploy.yml` si vas por esta opcion.
