'use client'

type Props = {
  headers: string[]
  rows: string[][]
  caption?: string
}

export function ComparisonTable({ headers, rows, caption }: Props) {
  if (!headers || headers.length === 0 || !rows || rows.length === 0) return null
  return (
    <div className="overflow-x-auto rounded-xl border border-glass-border/40 bg-glass-bg/40 backdrop-blur-md">
      {caption ? (
        <p className="px-4 pt-3 text-xs text-muted-foreground">{caption}</p>
      ) : null}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-bg-border/40">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-aurora-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-bg-border/20 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top text-sm leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
