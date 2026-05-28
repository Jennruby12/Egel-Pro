# Iconos PWA — EGELPro

Esta carpeta contiene los iconos para el `manifest.json` de la PWA.

## Estado actual

- `icon.svg` — fuente vectorial del logo (cuadrado redondeado #38bdf8 con letras "EP" blancas).
- `icon-192.png` y `icon-512.png` — **pendientes de generar**. El `manifest.json` ya los referencia.

> El agente que hizo el scaffold de la PWA no pudo ejecutar binarios en su entorno,
> por lo que los PNG no estan commiteados. Genera los PNG antes del primer deploy.

## Como generar los PNG (3 opciones)

### Opcion A — Script local incluido (recomendado)

Hay un script Node listo en `scripts/generate-pwa-icons.mjs` que produce
placeholders validos sin dependencias externas:

```bash
node scripts/generate-pwa-icons.mjs
```

Esto crea `icon-192.png` e `icon-512.png` en esta carpeta.

### Opcion B — Generador web

1. Sube `icon.svg` a https://realfavicongenerator.net o https://maskable.app/editor
2. Descarga los PNG en 192x192 y 512x512
3. Reemplaza los placeholders

### Opcion C — Con sharp (mas calidad)

```bash
npm i -D sharp
node -e "const s=require('sharp');['192','512'].forEach(n=>s('public/icons/icon.svg').resize(+n,+n).png().toFile('public/icons/icon-'+n+'.png'))"
```

## Diseno final pendiente

Estos placeholders son temporales. El diseno definitivo del logo de EGELPro deberia
sustituirlos antes del lanzamiento a produccion.
