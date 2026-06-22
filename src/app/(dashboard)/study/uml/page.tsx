'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Upload, FileCode2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MermaidDiagram } from '@/components/ui/MermaidDiagram'

const TEMPLATES: Record<string, string> = {
  'Diagrama de clases': `classDiagram
  class Pedido {
    +int id
    +Date fecha
    +calcularTotal() float
  }
  class Cliente {
    +String nombre
    +String email
  }
  class LineaPedido {
    +int cantidad
    +float precio
  }
  Cliente "1" --> "*" Pedido : realiza
  Pedido "1" *-- "*" LineaPedido : contiene`,
  'Secuencia': `sequenceDiagram
  actor U as Usuario
  participant S as Sistema
  participant DB as BaseDatos
  U->>S: Iniciar sesion(email, pass)
  S->>DB: Validar credenciales
  DB-->>S: OK
  S-->>U: Token de sesion`,
  'Casos de uso': `flowchart LR
  actor((Cliente))
  uc1([Realizar compra])
  uc2([Pagar])
  actor --> uc1
  uc1 -. include .-> uc2`,
  'PERT / actividades': `flowchart LR
  A[Inicio] --> B[Analisis 3d]
  B --> C[Diseno 5d]
  B --> D[Prototipo 2d]
  C --> E[Desarrollo 8d]
  D --> E
  E --> F[Pruebas 4d] --> G[Fin]`,
}

export default function UmlPlaygroundPage() {
  const [source, setSource] = useState<string>(TEMPLATES['Diagrama de clases'])
  const fileRef = useRef<HTMLInputElement>(null)

  function importFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSource(String(reader.result ?? ''))
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/study" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-aurora-2">
        <ChevronLeft className="h-3 w-3" /> Material de estudio
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Visualizador de diagramas UML</h1>
        <p className="text-sm text-muted-foreground">
          Escribe o importa un diagrama en formato Mermaid (clases, secuencia, casos de uso, PERT)
          y visualizalo. Puedes hacer zoom, copiar la fuente o descargar el SVG — funciona en movil.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {Object.keys(TEMPLATES).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setSource(TEMPLATES[name]!)}
            className="inline-flex items-center gap-1.5 rounded-full border border-glass-border/40 bg-glass-bg/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md transition-colors hover:border-aurora-2/40 hover:text-foreground"
          >
            <FileCode2 className="h-3.5 w-3.5" /> {name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full border border-aurora-2/40 bg-aurora-2/10 px-3 py-1 text-xs font-medium text-aurora-2 transition-colors hover:bg-aurora-2/20"
        >
          <Upload className="h-3.5 w-3.5" /> Importar archivo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".mmd,.txt,.mermaid,text/plain"
          onChange={importFile}
          className="hidden"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard variant="elevated" padding="md" className="space-y-2">
          <label htmlFor="mermaid-src" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Fuente (Mermaid)
          </label>
          <textarea
            id="mermaid-src"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            className="h-72 w-full resize-y rounded-lg border border-glass-border/40 bg-bg-base/60 p-3 font-mono text-xs leading-relaxed text-foreground outline-none focus:border-aurora-2/50"
          />
        </GlassCard>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vista previa</p>
          <MermaidDiagram chart={source} />
        </div>
      </div>
    </div>
  )
}
