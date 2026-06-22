'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, RotateCcw, Eye } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MermaidDiagram } from '@/components/ui/MermaidDiagram'

type Card = { prompt: string; mermaid: string; answer: string }

const CARDS: Card[] = [
  {
    prompt: '¿Que tipo de diagrama UML es y que relaciones muestra?',
    mermaid: `classDiagram
  class Persona { +String nombre }
  class Cliente { +String rfc }
  class Pedido { +int folio }
  Persona <|-- Cliente
  Cliente "1" --> "*" Pedido : realiza`,
    answer: 'Diagrama de CLASES. Persona <|-- Cliente es herencia (Cliente es-un Persona). Cliente "1" --> "*" Pedido es una asociacion uno-a-muchos.',
  },
  {
    prompt: '¿Que representa el rombo relleno en este diagrama?',
    mermaid: `classDiagram
  class Pedido { +calcularTotal() }
  class LineaPedido { +int cantidad }
  Pedido "1" *-- "*" LineaPedido : contiene`,
    answer: 'Composicion: la LineaPedido no existe sin su Pedido (todo-parte fuerte). El rombo hueco seria agregacion (relacion mas debil).',
  },
  {
    prompt: '¿Que tipo de diagrama es y que indica la linea vertical bajo cada participante?',
    mermaid: `sequenceDiagram
  actor U as Usuario
  participant S as Sistema
  U->>S: login(datos)
  S-->>U: token`,
    answer: 'Diagrama de SECUENCIA. La linea vertical es la linea de vida (lifeline); los mensajes fluyen en el tiempo de arriba hacia abajo. ->> es mensaje sincrono, -->> es respuesta.',
  },
  {
    prompt: '¿Que tipo de diagrama es y que modela?',
    mermaid: `flowchart LR
  A([Inicio]) --> B{Pago aprobado?}
  B -- Si --> C[Generar factura]
  B -- No --> D[Rechazar]
  C --> E([Fin])
  D --> E`,
    answer: 'Diagrama de ACTIVIDAD: modela el flujo de trabajo con decisiones (el rombo) y actividades en paralelo o secuenciales. Util para casos de uso complejos.',
  },
  {
    prompt: '¿Que tecnica de planeacion es y como se calcula su ruta critica?',
    mermaid: `flowchart LR
  A[A: 3d] --> B[B: 5d]
  A --> C[C: 2d]
  B --> D[D: 8d]
  C --> D`,
    answer: 'Red tipo PERT/CPM. La ruta critica es el camino mas largo: A-B-D = 16 dias (vs A-C-D = 13). Las actividades de la ruta critica no tienen holgura.',
  },
  {
    prompt: '¿Que tipo de diagrama UML es?',
    mermaid: `stateDiagram-v2
  [*] --> Pendiente
  Pendiente --> Pagado : pagar
  Pagado --> Enviado : enviar
  Enviado --> [*]`,
    answer: 'Diagrama de ESTADOS: muestra los estados de un objeto (Pedido) y las transiciones disparadas por eventos (pagar, enviar).',
  },
]

export default function FlashcardsUmlPage() {
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const card = CARDS[i]!

  function go(delta: number) {
    setRevealed(false)
    setI((prev) => (prev + delta + CARDS.length) % CARDS.length)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/study" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-aurora-2">
        <ChevronLeft className="h-3 w-3" /> Material de estudio
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Flashcards de diagramas UML</h1>
        <p className="text-sm text-muted-foreground">
          Identifica el tipo de diagrama y sus relaciones. Mira el diagrama, responde mentalmente y revela.
        </p>
      </header>

      <GlassCard variant="elevated" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Tarjeta {i + 1} de {CARDS.length}</span>
        </div>

        <p className="text-base font-semibold">{card.prompt}</p>
        <MermaidDiagram chart={card.mermaid} />

        {revealed ? (
          <div className="rounded-xl border border-success/40 bg-success/10 p-4 text-sm leading-relaxed">
            {card.answer}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-aurora-2/50 bg-aurora-2/15 px-4 py-2 text-sm font-semibold text-aurora-2 transition-colors hover:bg-aurora-2/25"
          >
            <Eye className="h-4 w-4" /> Mostrar respuesta
          </button>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex items-center gap-1 rounded-xl border border-glass-border/40 bg-glass-bg/40 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <button
            type="button"
            onClick={() => { setI(0); setRevealed(false) }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex items-center gap-1 rounded-xl border border-aurora-2/50 bg-aurora-2/15 px-4 py-2 text-sm font-semibold text-aurora-2 transition-colors hover:bg-aurora-2/25"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
