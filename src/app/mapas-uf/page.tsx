'use client'

import { useEffect, useState } from 'react'
import { ProcurementCard } from '@/components/ProcurementCard'
import { UfHeatStrip } from '@/components/UfHeatStrip'
import { countByUf } from '@/lib/countByUf'
import { formatBrl } from '@/lib/format'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function MapaInteligencia() {
  const [data, setData] = useState<Procurement[]>([])
  const [uf, setUf] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    searchPncp({ q: 'tecnologia', tam_pagina: 40 }, ctrl.signal)
      .then((items) => {
        if (!ctrl.signal.aborted) setData(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  const filtered = uf ? data.filter((p) => p.uf === uf) : data
  const totalValue = filtered.reduce((s, p) => s + p.valueBrl, 0)
  const counts = countByUf(data)
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="animate-pulse text-sm text-[var(--muted)]">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Mapa de Inteligência por UF</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Distribuição geográfica de oportunidades (PNCP).
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Oportunidades
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
            {filtered.length}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Valor total
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
            {formatBrl(totalValue)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            UF em destaque
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
            {sorted[0]?.[0] || '—'}
          </p>
        </div>
      </div>

      <UfHeatStrip items={data} selectedUf={uf} onSelectUf={setUf} />

      <section>
        <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">
          {uf ? `Licitações em ${uf}` : 'Todas as licitações'}
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.slice(0, 10).map((p) => (
            <ProcurementCard key={p.id} procurement={p} showShare />
          ))}
        </div>
      </section>
    </div>
  )
}
