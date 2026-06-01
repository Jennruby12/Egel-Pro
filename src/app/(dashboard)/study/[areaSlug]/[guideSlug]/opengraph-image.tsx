import { ImageResponse } from 'next/og'
import { createAdminClient } from '@/lib/supabase/server'
import { findArea } from '@/modules/study/lib/area-slugs'

export const runtime = 'nodejs'
export const alt = 'Guia EGEL Pro'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { areaSlug: string; guideSlug: string }

export default async function GuideOgImage({ params }: { params: Params }) {
  const area = findArea(params.areaSlug)
  let title = 'Guia de estudio'
  let weight: number | null = null

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('guides')
      .select('title, weight_in_exam')
      .eq('slug', params.guideSlug)
      .maybeSingle()
    if (data) {
      title = data.title
      weight = data.weight_in_exam ?? null
    }
  } catch {
    // fallback al titulo default
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1340 50%, #0a0f1e 100%)',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#38bdf8', fontSize: 28, fontWeight: 600 }}>
          <span>EGEL Pro</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: '#a78bfa', fontSize: 22 }}>{area?.name ?? 'Estudio'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
            {title}
          </div>
          {weight ? (
            <div
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '8px 20px',
                borderRadius: 999,
                border: '2px solid #34d399',
                color: '#34d399',
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {weight} reactivos en el examen
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#9ca3af' }}>
          <span>Simulador EGEL Plus ISOFT (CENEVAL)</span>
          <span>egelpro.app</span>
        </div>
      </div>
    ),
    size,
  )
}
