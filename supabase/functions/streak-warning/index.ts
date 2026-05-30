// Edge Function: enviar email "tu racha de N dias se rompe pronto" a usuarios
// con racha activa que NO han entrado hoy (hora local Mexico).
//
// Schedule: cada dia a las 21:00 America/Mexico_City (= 03:00 UTC siguiente dia).
// Configurar cron en Supabase Dashboard > Database > Cron Jobs:
//   SELECT cron.schedule('streak-warning-daily', '0 3 * * *',
//     'SELECT net.http_post(url:=''https://<project>.supabase.co/functions/v1/streak-warning'',
//                            headers:=''{"Authorization": "Bearer <SERVICE_ROLE>"}''::jsonb)');
//
// Requiere RESEND_API_KEY en Secrets (Dashboard > Edge Functions > Secrets).
// Si no esta configurada, la function loggea y termina sin error.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM = 'EGELPro <noreply@egelpro.app>'
const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') ?? 'https://egel-pro.vercel.app'

// Mexico (CST/CDT) UTC offset varia con horario de verano. Usamos -6 fijo.
function todayInMexico(): string {
  const d = new Date()
  const offsetMs = -6 * 60 * 60 * 1000
  const mx = new Date(d.getTime() + offsetMs)
  return mx.toISOString().slice(0, 10)
}

Deno.serve(async (req) => {
  // Verificacion basica: solo aceptar POST con auth header
  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.includes(SERVICE_ROLE)) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!RESEND_API_KEY) {
    console.log('[streak-warning] RESEND_API_KEY not set, skipping send')
    return new Response(JSON.stringify({ skipped: true, reason: 'no_resend_key' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const today = todayInMexico()
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

  // Usuarios con racha activa que NO entraron hoy
  const { data: candidates, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, streak_current, last_activity_date, notification_prefs')
    .gt('streak_current', 0)
    .neq('last_activity_date', today)

  if (error) {
    console.error('[streak-warning] query error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  let sent = 0
  let skipped = 0

  for (const user of candidates ?? []) {
    // Respetar pref del user
    const prefs = (user.notification_prefs ?? {}) as Record<string, boolean | undefined>
    if (prefs.streak_warning === false) {
      skipped++
      continue
    }

    const subject = `Tu racha de ${user.streak_current} dias se rompe pronto`
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0a0f1e; color: #e5e7eb;">
        <h1 style="color: #38bdf8;">Hey ${user.full_name ?? 'estudiante'}</h1>
        <p>Tu racha de <strong style="color: #f97316;">${user.streak_current} dias</strong> esta a punto de romperse.</p>
        <p>Solo necesitas entrar a EGELPro hoy antes de medianoche para mantenerla viva.</p>
        <p style="margin: 32px 0;">
          <a href="${APP_URL}/dashboard" style="background: #38bdf8; color: #0a0f1e; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Mantener mi racha</a>
        </p>
        <p style="font-size: 12px; color: #6b7280; margin-top: 32px;">
          Si no quieres recibir estos avisos, desactivalos en <a href="${APP_URL}/profile" style="color: #38bdf8;">tu perfil</a>.
        </p>
      </div>
    `

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: user.email,
          subject,
          html,
        }),
      })
      if (res.ok) {
        sent++
        await supabase.from('email_logs').insert({
          user_id: user.id,
          type: 'streak_warning',
          status: 'sent',
        })
      } else {
        skipped++
        await supabase.from('email_logs').insert({
          user_id: user.id,
          type: 'streak_warning',
          status: 'failed',
        })
      }
    } catch (e) {
      skipped++
      console.error(`[streak-warning] error sending to ${user.email}:`, e)
    }
  }

  return new Response(
    JSON.stringify({ sent, skipped, total: candidates?.length ?? 0, date: today }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
