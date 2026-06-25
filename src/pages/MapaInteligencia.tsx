import { useMemo, useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { countByUf } from '../utils/countByUf'
import { formatBrl } from '../utils/format'
import { StatCard } from '../components/StatCard'
import { ProcurementCard } from '../components/ProcurementCard'
import type { Procurement } from '../types'

const SCORE_BANDS = [60, 70, 80, 90]

export function MapaInteligencia() {
  const [minScore, setMinScore] = useState<number>(60)
  const [selectedTopUf, setSelectedTopUf] = useState<string | null>(null)
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    searchPncp({ q: 'tecnologia', tam_pagina: 50 }, controller.signal)
      .then(items => { if (!controller.signal.aborted) { setData(items); setLoading(false) } })
      .catch(() => { if (!controller.signal.aborted) { setError('Falha ao carregar dados'); setLoading(false) } })
    return () => controller.abort()
  }, [])

  const byScore = useMemo(() => {
    return data.filter(p => {
      if (p.technicalScore == null) return true
      return p.technicalScore >= minScore
    })
  }, [data, minScore])

  const counts = countByUf(byScore)
  const top5 = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const list = useMemo(() => {
    if (!selectedTopUf) return byScore
    return byScore.filter((p) => p.uf === selectedTopUf)
  }, [byScore, selectedTopUf])

  const totalValue = byScore.reduce((s, p) => s + p.valueBrl, 0)
  const highlight = top5[0]

  const medals = ['🥇', '🥈', '🥉', '4º', '5º']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando dados da PNCP...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-[var(--text)]">Mapas UF</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Distribuição geográfica das oportunidades da PNCP.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-[var(--muted)]">Filtrar por Top Score:</span>
        {SCORE_BANDS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setMinScore(n)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              minScore === n
                ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent-dim)]'
            }`}
          >
            Top {n}%
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Oportunidades" value={String(byScore.length)} />
        <StatCard
          label="Valor total dos certames"
          value={formatBrl(totalValue)}
        />
        <StatCard
          label="Estado com mais oportunidades"
          value={highlight ? highlight[0] : '—'}
          hint={
            highlight
              ? `${highlight[1]} certame(s) neste recorte`
              : 'Ajuste o filtro'
          }
        />
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Top 5 estados neste recorte
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Clique em um estado para ver as oportunidades abaixo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {top5.map(([uf, n], i) => {
            const active = selectedTopUf === uf
            return (
              <button
                key={uf}
                type="button"
                onClick={() => setSelectedTopUf(active ? null : uf)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent-dim)]'
                }`}
              >
                <span role="img" aria-label={`Posição ${i + 1}`}>{medals[i]}</span>
                <span>{uf}</span>
                <span className="font-mono text-xs text-[var(--muted)]">({n})</span>
              </button>
            )
          })}
        </div>
        {selectedTopUf ? (
          <button
            type="button"
            className="mt-3 text-xs font-medium text-[var(--accent)] hover:underline"
            onClick={() => setSelectedTopUf(null)}
          >
            Mostrar todos os estados
          </button>
        ) : null}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--text)]">Oportunidades</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {list.map((p) => (
            <ProcurementCard key={p.id} procurement={p} showShare />
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Nenhuma licitação encontrada para este filtro.
          </p>
        ) : null}
      </section>
    </div>
  )
}
