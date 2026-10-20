'use client'

import { useState } from 'react'
import { ProcurementCard } from '@/components/ProcurementCard'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function PesquisaPrecos() {
  const [q, setQ] = useState('')
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!q.trim()) return
    setLoading(true)
    const items = await searchPncp({ q: q.trim(), tam_pagina: 20 })
    setData(items)
    setLoading(false)
  }

  const totalValue = data.reduce((s, p) => s + p.valueBrl, 0)

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Pesquisa de Preços</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Levantamento de valores de referência com base em licitações reais da PNCP.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Item / serviço
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ex: servidor, firewall, software..."
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="self-end rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Pesquisar'}
        </button>
      </div>

      {data.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Valor total estimado do recorte
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            }).format(totalValue)}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {data.length} registro(s) encontrado(s)
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {data.map((p) => (
          <ProcurementCard key={p.id} procurement={p} showShare />
        ))}
      </div>
    </div>
  )
}
