#!/usr/bin/env bash
# Configura los secrets de GitHub Actions para Leonard-ssj/Egel-Pro
# desde valores en .env.local. Requiere `gh auth login` previo.

set -e

cd "$(dirname "$0")/.."

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI no instalado. Descarga: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "No estas autenticado. Corre: gh auth login"
  exit 1
fi

if [ ! -f .env.local ]; then
  echo ".env.local no existe"
  exit 1
fi

REPO="Leonard-ssj/Egel-Pro"

# Helper: lee variable de .env.local
read_env() {
  grep -E "^$1=" .env.local 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '\r'
}

set_secret() {
  local name="$1"
  local value="$2"
  if [ -z "$value" ]; then
    echo "SKIP $name (vacio)"
    return
  fi
  echo "$value" | gh secret set "$name" --repo "$REPO" --body -
  echo "OK   $name"
}

echo "Configurando secrets en $REPO..."
set_secret "NEXT_PUBLIC_SUPABASE_URL" "$(read_env NEXT_PUBLIC_SUPABASE_URL)"
set_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$(read_env NEXT_PUBLIC_SUPABASE_ANON_KEY)"
set_secret "SUPABASE_SERVICE_ROLE_KEY" "$(read_env SUPABASE_SERVICE_ROLE_KEY)"
set_secret "VERCEL_TOKEN" "$(read_env VERCEL_TOKEN)"

# Vercel project/org IDs estan en .vercel/project.json
if [ -f .vercel/project.json ]; then
  set_secret "VERCEL_ORG_ID" "$(grep -E '"orgId"' .vercel/project.json | cut -d'"' -f4)"
  set_secret "VERCEL_PROJECT_ID" "$(grep -E '"projectId"' .vercel/project.json | cut -d'"' -f4)"
else
  echo "WARN: .vercel/project.json no existe. Corre 'vercel link' primero."
fi

echo ""
echo "Listo. Verifica en https://github.com/$REPO/settings/secrets/actions"
