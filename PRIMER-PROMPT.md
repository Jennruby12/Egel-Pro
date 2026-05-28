# PRIMER PROMPT — Copiar y pegar en Claude Code

## PASO 1: Abrir el proyecto en VSCode
```
Abrir VSCode → File → Open Folder → seleccionar esta carpeta (egel-pro)
```

## PASO 2: Instalar prerequisitos (terminal del sistema, UNA SOLA VEZ)
```bash
# Instalar Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Instalar Supabase CLI
npm install -g supabase

# Autenticar Claude Code
claude login
```

## PASO 3: Configurar Supabase MCP (UNA SOLA VEZ)
```bash
# Obtener tu Access Token en: supabase.com → Account → Access Tokens
# Obtener tu Project Ref en: supabase.com → tu proyecto → Settings → General → Reference ID

claude mcp add supabase -s user -- npx -y @supabase/mcp-server-supabase@latest \
  --access-token TU_ACCESS_TOKEN_AQUI \
  --project-ref TU_PROJECT_REF_AQUI

# Verificar que quedo instalado
claude mcp list
```

## PASO 4: Copiar .env.example a .env.local y rellenar
```bash
cp .env.example .env.local
# Editar .env.local con tus keys de Supabase
```

## PASO 5: Abrir Claude Code en la terminal de VSCode
```bash
# En la terminal integrada de VSCode (Ctrl+` o Cmd+`)
claude
```

---

## PEGAR ESTE TEXTO COMO PRIMER MENSAJE EN CLAUDE CODE:

```
Hola! Somos Leonardo y Claude trabajando juntos en EGELPro.

EGELPro es un SaaS para preparar el examen EGEL Plus ISOFT de CENEVAL (Mexico).
Es un simulador de examen + guias de estudio + gamificacion estilo Duolingo.

Lee primero el archivo .claude/CLAUDE.md — tiene TODO el contexto del proyecto:
stack, arquitectura, patrones de codigo, schema de DB, seguridad, y convenciones.

Tambien tenemos documentacion de referencia en ../05-Herramientas/:
- PRD-SIMULADOR-EGEL-WEB.md        → Especificacion del producto
- ARQUITECTURA-Y-WORKSPACE.md      → DB schema completo SQL + patrones
- FUNCIONALIDADES-SAAS-EGEL.html   → Todas las pantallas y features (80+)
- TASKS-CLAUDE-CODE.md             → 27 tasks ordenadas para construir todo
- DESIGN-SYSTEM.md                 → Tokens Tailwind, colores, animaciones

Tenemos acceso al MCP de Supabase para gestionar la base de datos directamente.
El stack es: Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui + Supabase + Vercel.
Arquitectura: Feature-Based Modular (cada feature en src/modules/X/).

PRIMERA TAREA — TASK-001: Setup inicial del proyecto.

1. Lee el CLAUDE.md completo
2. Dime en 3-4 lineas que entendiste del proyecto
3. Luego ejecuta estos comandos para inicializar:

   npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --eslint

   (Si ya existe next.config.js, confirmar sobreescritura — si)

4. Instala las dependencias del package.json que ya existe en el proyecto
5. Inicializa shadcn/ui con: npx shadcn@latest init (New York style, zinc, CSS variables: yes)
6. Agrega componentes shadcn: button card badge input label textarea dialog sheet tabs select progress toast sonner table dropdown-menu form avatar separator scroll-area skeleton
7. Inicializa Supabase: supabase init
8. Usa el MCP de Supabase para crear todas las migrations del schema
   El schema completo SQL esta en ARQUITECTURA-Y-WORKSPACE.md seccion 4
9. Aplica las migrations: supabase db push
10. Genera tipos TypeScript: supabase gen types typescript --local > src/types/database.ts

Empezamos!
```

---

## PROMPTS DE LAS TASKS SIGUIENTES

Una vez terminada TASK-001, continuar con este formato:

```
Excelente! TASK-001 completada. Ahora vamos con TASK-002.

Lee las instrucciones de TASK-002 en el archivo ../05-Herramientas/TASKS-CLAUDE-CODE.md
y ejecutala completa. Recuerda seguir los patrones del CLAUDE.md.
```

Cambiar el numero segun la task. Las tasks van del 001 al 027.

---

## SKILLS DISPONIBLES (slash commands)

Dentro de Claude Code puedes usar:
- `/create-migration` — crear nueva migration de Supabase
- `/add-question` — agregar pregunta al banco de preguntas
- `/add-module` — scaffold de nuevo feature module
- `/check-security` — auditoria de seguridad de un archivo
- `/gen-types` — regenerar tipos TypeScript de Supabase
- `/create-component` — crear componente React
- `/create-server-action` — crear Server Action
- `/run-tests` — ejecutar y verificar todos los tests

---

## FLUJO DIARIO

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Claude Code
claude

# Cuando termines una tarea:
npm run typecheck   # Verificar tipos
npm run test        # Correr tests
git add . && git commit -m "feat: [descripcion]"
git push            # Vercel hace deploy automatico
```
