'use client'

import { useState } from 'react'
import { ChevronDown, BookA } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Term = {
  term: string
  def: string
}

type Props = {
  terms: Term[]
}

export function GlossaryAccordion({ terms }: Props) {
  if (!terms || terms.length === 0) return null
  return (
    <div className="space-y-1.5">
      {terms.map((t, i) => (
        <GlossaryRow key={i} term={t} />
      ))}
    </div>
  )
}

function GlossaryRow({ term }: { term: Term }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full overflow-hidden rounded-lg border border-glass-border/40 bg-glass-bg/40 text-left backdrop-blur-md transition-colors hover:border-aurora-2/30"
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <BookA className="h-4 w-4 shrink-0 text-aurora-2" />
        <span className="flex-1 text-sm font-semibold">{term.term}</span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </div>
      {open ? (
        <div className="border-t border-glass-border/30 px-3 py-2 text-sm text-muted-foreground">
          {term.def}
        </div>
      ) : null}
    </button>
  )
}
