'use client'

import { ExternalLink, Wrench } from 'lucide-react'

type Tool = {
  name: string
  url?: string
  description?: string
}

type Props = {
  tools: Tool[]
}

export function ToolBadge({ tools }: Props) {
  if (!tools || tools.length === 0) return null
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {tools.map((t, i) => {
        const Wrapper = t.url ? 'a' : 'div'
        return (
          <Wrapper
            key={i}
            {...(t.url ? { href: t.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex items-center gap-3 rounded-lg border border-glass-border/40 bg-glass-bg/40 p-3 backdrop-blur-md transition-colors hover:border-aurora-2/40 hover:bg-aurora-2/5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aurora-2/15 text-aurora-2">
              <Wrench className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.name}</p>
              {t.description ? (
                <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
              ) : null}
            </div>
            {t.url ? <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /> : null}
          </Wrapper>
        )
      })}
    </div>
  )
}
