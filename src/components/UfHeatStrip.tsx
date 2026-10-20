'use client'

import { countByUf } from '@/lib/countByUf'
import type { Procurement } from '@/types'

function mixHex(a: string, b: string, t: number): string {
  const h = (x: string) => Number.parseInt(x.slice(1), 16)
  const r1 = (h(a) >> 16) & 255
  const g1 = (h(a) >> 8) & 255
  const b1 = h(a) & 255
  const r2 = (h(b) >> 16) & 255
  const g2 = (h(b) >> 8) & 255
  const b2 = h(b) & 255
  const k = t / 100
  return `rgb(${Math.round(r1 + (r2 - r1) * k)},${Math.round(g1 + (g2 - g1) * k)},${Math.round(b1 + (b2 - b1) * k)})`
}

type Props = {
  items: Procurement[]
  selectedUf: string | null
  onSelectUf: (uf: string | null) => void
}

export function UfHeatStrip({ items, selectedUf, onSelectUf }: Props) {
  const counts = countByUf(items)
  const max = Math.max(...Object.values(counts), 1)
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map(([uf, n]) => (
        <button
          key={uf}
          type="button"
          onClick={() => onSelectUf(selectedUf === uf ? null : uf)}
          className={`min-w-[3.25rem] rounded-lg border border-[var(--border)] p-2 text-xs font-bold text-[var(--text)] ${
            selectedUf === uf ? 'outline outline-2 outline-[var(--accent)]' : ''
          }`}
          style={{ background: mixHex('#0d9488', '#132a45', (n / max) * 100) }}
        >
          {uf} {n}
        </button>
      ))}
    </div>
  )
}
