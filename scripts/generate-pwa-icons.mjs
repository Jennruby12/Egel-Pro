// Genera placeholders PNG validos para la PWA usando solo APIs nativas de Node.
// Pinta un cuadrado redondeado azul cielo (#38bdf8) con las letras "EP" en blanco.
// Ejecuta: node scripts/generate-pwa-icons.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

// Color brand (sky-400 = #38bdf8) y blanco
const BRAND = [0x38, 0xbd, 0xf8, 0xff]
const WHITE = [0xff, 0xff, 0xff, 0xff]
const TRANSPARENT = [0, 0, 0, 0]

// CRC table para PNG
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

// Bitmap muy simple 5x7 para "E" y "P" (1 = pintado)
const GLYPHS = {
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  P: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
}

function generate(size) {
  const px = (x, y) => (y * size + x) * 4
  const buf = new Uint8Array(size * size * 4)

  // Radio para esquinas redondeadas (~22% del lado, estilo iOS/maskable)
  const r = Math.floor(size * 0.22)

  // Pinta fondo brand con esquinas redondeadas (resto transparente)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inside = true
      if (x < r && y < r) {
        const dx = r - x
        const dy = r - y
        if (dx * dx + dy * dy > r * r) inside = false
      } else if (x >= size - r && y < r) {
        const dx = x - (size - r - 1)
        const dy = r - y
        if (dx * dx + dy * dy > r * r) inside = false
      } else if (x < r && y >= size - r) {
        const dx = r - x
        const dy = y - (size - r - 1)
        if (dx * dx + dy * dy > r * r) inside = false
      } else if (x >= size - r && y >= size - r) {
        const dx = x - (size - r - 1)
        const dy = y - (size - r - 1)
        if (dx * dx + dy * dy > r * r) inside = false
      }
      const color = inside ? BRAND : TRANSPARENT
      buf[px(x, y)] = color[0]
      buf[px(x, y) + 1] = color[1]
      buf[px(x, y) + 2] = color[2]
      buf[px(x, y) + 3] = color[3]
    }
  }

  // Dibuja "EP" centrado: cada glyph 5x7, separacion 1 col -> total 11 cols x 7 filas
  const cols = 5 + 1 + 5
  const rows = 7
  // Escala para que ocupe ~55% del lado
  const target = Math.floor(size * 0.55)
  const scale = Math.max(1, Math.floor(target / cols))
  const wPx = cols * scale
  const hPx = rows * scale
  const offX = Math.floor((size - wPx) / 2)
  const offY = Math.floor((size - hPx) / 2)

  const drawGlyph = (glyph, originX) => {
    for (let gy = 0; gy < 7; gy++) {
      for (let gx = 0; gx < 5; gx++) {
        if (!glyph[gy][gx]) continue
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const x = originX + gx * scale + sx
            const y = offY + gy * scale + sy
            if (x < 0 || y < 0 || x >= size || y >= size) continue
            buf[px(x, y)] = WHITE[0]
            buf[px(x, y) + 1] = WHITE[1]
            buf[px(x, y) + 2] = WHITE[2]
            buf[px(x, y) + 3] = WHITE[3]
          }
        }
      }
    }
  }

  drawGlyph(GLYPHS.E, offX)
  drawGlyph(GLYPHS.P, offX + (5 + 1) * scale)

  // Empaqueta como PNG (RGBA, sin filtro)
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter type 0
    Buffer.from(buf.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1)
  }
  const idatData = deflateSync(raw)

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const size of [192, 512]) {
  const file = resolve(outDir, `icon-${size}.png`)
  writeFileSync(file, generate(size))
  console.log(`OK ${file}`)
}
