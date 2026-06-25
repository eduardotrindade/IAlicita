import { useMemo, useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { countByUf } from '../utils/countByUf'
import { formatBrl } from '../utils/format'
import { StatCard } from '../components/StatCard'
import { UfHeatStrip } from '../components/UfHeatStrip'
import { ProcurementCard } from '../components/ProcurementCard'
import type { Procurement } from '../types'

export function Dashboard() {
  const [uf, setUf] = useState<string | null>(null)
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    searchPncp({ q: 'tecnologia', tam_pagina: 40 }, controller.signal)
      .then(items => { if (!controller.signal.aborted) { setData(items); setLoading(false) } })
      .catch(() => { if (!controller.signal.aborted) { setError('Falha ao carregar dados da PNCP'); setLoading(false) } })
    return () => controller.abort()
  }, [])

  const filtered = useMemo(() => {
    if (!uf) return data
    return data.filter((p) => p.uf === uf)
  }, [data, uf])

  const totalValue = filtered.reduce((s, p) => s + p.valueBrl, 0)
  const counts = countByUf(filtered)
  const topUf = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]

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
      <section>
        <h2 className="text-base font-semibold text-[var(--text)]">Dashboard</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Oportunidades reais do Portal Nacional de Contratações Públicas.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard label="Oportunidades (filtrado)" value={String(filtered.length)} />
          <StatCard
            label="Valor total estimado"
            value={formatBrl(totalValue)}
            hint={uf ? `Somente ${uf}` : 'Todas as UFs com match'}
          />
          <StatCard
            label="UF com mais oportunidades"
            value={topUf ? topUf[0] : '—'}
            hint={topUf ? `${topUf[1]} certame(s) neste recorte` : undefined}
          />
        </div>
      </section>

      <UfHeatStrip
        items={data}
        selectedUf={uf}
        onSelectUf={setUf}
      />

      <section>
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Licitações recentes
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Use os botões WhatsApp e Telegram em cada card para enviar o resumo da
          oportunidade.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {filtered.slice(0, 6).map((p) => (
            <ProcurementCard key={p.id} procurement={p} showShare />
          ))}
        </div>
      </section>
    </div>
  )
}
