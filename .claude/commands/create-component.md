# /create-component — Crear Componente React

Crea un componente React siguiendo el design system y convenciones de EGELPro.

## Input del usuario
- Nombre (PascalCase)
- Modulo al que pertenece
- Descripcion funcional
- Props necesarias
- Si necesita 'use client'

## Template base

```typescript
// src/modules/[modulo]/components/[NombreComponente].tsx
'use client' // Solo si necesita hooks, eventos o estado del browser

import { cn } from '@/lib/utils/cn'
// Imports de shadcn/ui, lucide-react, framer-motion segun necesidad

interface [NombreComponente]Props {
  // Props bien tipadas
  className?: string
}

export function [NombreComponente]({ className, ...props }: [NombreComponente]Props) {
  return (
    <div className={cn(
      'bg-bg-surface border border-bg-border rounded-2xl p-6',
      className
    )}>
      {/* contenido */}
    </div>
  )
}

export default [NombreComponente]
```

## Reglas de diseno
- Fondo de cards: `bg-bg-surface border border-bg-border rounded-2xl`
- Texto principal: `text-text-primary`
- Texto secundario: `text-text-secondary`
- Colores de area: `text-area1`, `text-area2`, `text-area3`, `text-area4`
- Hover en cards: `hover:border-brand-400/50 transition-colors`
- Animaciones: Framer Motion con `fadeInUp` o `cardHover` de `@/lib/utils/animations`
- Iconos: `lucide-react` con size={16}, size={18}, o size={24}
- NUNCA inline styles — solo Tailwind

## Despues de crear
- Agregar export al `components/index.ts` del modulo
- Si es generico, considerar moverlo a `components/shared/`
- Agregar `data-testid` en elementos interactivos
