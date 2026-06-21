import { ImageResponse } from 'next/og'

// OG image raiz en PNG (1200x630). Las redes sociales (WhatsApp, Facebook,
// X/Twitter, LinkedIn) NO renderizan SVG en og:image, por eso generamos PNG.
export const runtime = 'nodejs'
export const alt = 'EGEL Pro — Simulador del EGEL Plus ISOFT (CENEVAL)'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #060716 0%, #1a1340 50%, #060716 100%)',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 700 }}>
          <span style={{ color: '#9F7AFF' }}>EGEL</span>
          <span>Pro</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>
            Aprueba el EGEL Plus ISOFT
          </div>
          <div style={{ fontSize: 30, color: '#cbd5e1', maxWidth: 980 }}>
            Simulador, guias de estudio y gamificacion. Banco de reactivos tipo CENEVAL.
          </div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '10px 22px',
              borderRadius: 999,
              border: '2px solid #34d399',
              color: '#34d399',
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            203 reactivos · 2 sesiones · niveles de desempeno CENEVAL
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#94a3b8' }}>
          <span>Preparacion para el EGEL Plus en Ingenieria de Software</span>
          <span>egel-pro.vercel.app</span>
        </div>
      </div>
    ),
    size,
  )
}
