# Cron de streak warning — pasos para activar

La Edge Function en `supabase/functions/streak-warning/index.ts` está lista. Pasos para activarla:

## 1. Configurar Resend (gratis)

1. https://resend.com/signup
2. Verificar dominio o usar `noreply@egelpro.app` (Resend te da uno default `onresend.dev`)
3. Generar API key

## 2. Deploy de la Edge Function

```bash
# Instalar Supabase CLI si no la tienes
npm install -g supabase

# Login
supabase login

# Link al proyecto
cd c:/Users/leona/EGEL/egel-pro
supabase link --project-ref fcissioekvahzklhvsnd

# Set secret
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx

# Deploy
supabase functions deploy streak-warning
```

## 3. Configurar cron en Supabase Dashboard

https://supabase.com/dashboard/project/fcissioekvahzklhvsnd/database/cron-jobs

Activar extensiones (si no están):
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

Crear cron:
```sql
SELECT cron.schedule(
  'streak-warning-daily',
  '0 3 * * *', -- 03:00 UTC = 21:00 hora Mexico (CST UTC-6)
  $$
  SELECT net.http_post(
    url := 'https://fcissioekvahzklhvsnd.supabase.co/functions/v1/streak-warning',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key'),
      'Content-Type', 'application/json'
    )
  );
  $$
);
```

(Necesitas guardar el `service_role_key` en `vault.secrets` primero, o pegar el secret raw en el SQL — menos seguro.)

## 4. Test manual

```bash
curl -X POST \
  https://fcissioekvahzklhvsnd.supabase.co/functions/v1/streak-warning \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

Respuesta esperada:
```json
{ "sent": 3, "skipped": 0, "total": 3, "date": "2026-05-30" }
```

## Costo

- Edge Functions free tier: 500K invocations/mes — 1/día × 30 días = 30. Sobra.
- Resend free: 3K emails/mes, 100/día. Suficiente hasta ~300 usuarios con racha.

## Cuándo activar

Cuando tengas al menos 50 usuarios activos con racha. Antes es overkill.
