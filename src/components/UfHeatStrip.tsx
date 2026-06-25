import { memo } from 'react'
import type { Procurement } from '../types'
import { countByUf } from '../utils/countByUf'

type Props = {
  items: Procurement[]
  selectedUf: string | null
  onSelectUf: (uf: string | null) => void
}

export const UfHeatStrip = memo(function UfHeatStrip({ items, selectedUf, onSelectUf }: Props) {
  const counts = countByUf(items)
  const max = Math.max(1, ...Object.values(counts))
  const ufs = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Oportunidades por UF (mapa de calor simplificado)
        </h3>
        {selectedUf ? (
          <button
            type="button"
            className="text-xs font-medium text-[var(--accent)] hover:underline"
            onClick={() => onSelectUf(null)}
          >
            Limpar UF
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {ufs.map(([uf, n]) => {
          const intensity = n / max
          const active = selectedUf === uf
          return (
            <button
              key={uf}
              type="button"
              title={`${uf}: ${n} oportunidade(s)`}
              onClick={() => onSelectUf(active ? null : uf)}
              className={`min-w-[3.25rem] rounded-lg border px-2 py-2 text-center transition-all ${
                active
                  ? 'border-[var(--accent)] ring-2 ring-[var(--ring)]'
                  : 'border-[var(--border)] hover:border-[var(--accent-dim)]'
              }`}
              style={{
                background: `color-mix(in srgb, var(--heat) ${Math.round(intensity * 100)}%, var(--surface))`,
              }}
            >
              <span className="block text-xs font-bold text-[var(--text)]">
                {uf}
              </span>
              <span className="block font-mono text-[10px] text-[var(--muted)]">
                {n}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Clique em um estado para filtrar a lista abaixo. Em uma próxima etapa,
        isto pode ser substituído pelo mapa SVG do Brasil.
      </p>
    </div>
  )
})
