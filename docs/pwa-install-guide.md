# Cómo instalar EGELPro como app

EGELPro está construida como **PWA** (Progressive Web App). Esto significa que puedes instalarla en tu teléfono o computadora y se comporta como una app nativa: ícono en la pantalla de inicio, abre en pantalla completa, funciona offline para quizzes ya cargados.

## 📱 iPhone / iPad (Safari)

Apple no muestra el botón automático de "Instalar app". El usuario debe usar el menú compartir:

1. Abre **https://egel-pro.vercel.app** en **Safari** (NO Chrome ni Firefox — esos no permiten instalar PWA en iOS por restricciones de Apple)
2. Toca el ícono de **Compartir** (cuadrado con flecha arriba, en la barra inferior)
3. Desplázate hacia abajo y toca **"Añadir a pantalla de inicio"** (Add to Home Screen)
4. Confirma el nombre "EGELPro" → toca **Añadir**
5. La app aparece en tu pantalla de inicio con el ícono de EGELPro
6. Ábrela desde ahí → corre en pantalla completa, sin barra del navegador

**Tip:** una vez instalada, las sesiones de quiz se guardan localmente. Aunque pierdas señal en el metro, puedes seguir respondiendo y se sincroniza al recuperar conexión.

## 📱 Android (Chrome)

Más fácil que iOS:

1. Abre **https://egel-pro.vercel.app** en **Chrome**
2. Chrome muestra automáticamente un banner "Añadir EGELPro a la pantalla de inicio" → tócalo
3. Si no aparece: menú (3 puntos) → **"Instalar app"** o **"Añadir a pantalla de inicio"**
4. Confirma → la app aparece en el cajón de apps + pantalla de inicio

## 💻 Computadora (Chrome, Edge, Brave)

1. Abre **https://egel-pro.vercel.app** en Chrome o Edge
2. En la barra de URL aparece un ícono ⊕ a la derecha
3. Tócalo → **"Instalar EGELPro"**
4. La app se abre en una ventana propia, accesible desde el menú de inicio

## 🎨 Ícono y manifest

Configurado en `public/manifest.json`:
- **Color tema:** `#38bdf8` (azul brand)
- **Fondo:** `#0a0f1e` (nebulosa profunda)
- **Iconos:** 192x192 y 512x512 PNG, soporta maskable
- **Orientación:** portrait
- **Display:** standalone (sin barra del navegador)

Para que el icono aparezca también como **favicon** en pestañas de navegador, agregué `src/app/icon.png` y `src/app/apple-icon.png` que Next.js 14 detecta automáticamente.

## ✅ Verificar instalación correcta

Después de instalar:
1. Abre la app desde el ícono (no desde el navegador)
2. Debes ver el splash screen azul oscuro mientras carga
3. La app debe abrir sin barra de URL
4. Login con Google o email → mantiene sesión 30 días

## 🐛 Si no aparece la opción de instalar

- iPhone: **debe ser Safari**, no Chrome (Chrome en iOS comparte el motor de Safari pero no muestra el botón)
- Verifica que `manifest.json` y `sw.js` cargan: ve a https://egel-pro.vercel.app/manifest.json — debe mostrar JSON
- Limpia caché del navegador y recarga
