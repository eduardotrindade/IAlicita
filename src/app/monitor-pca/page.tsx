'use client'

import { useEffect, useState } from 'react'
import { ProcurementCard } from '@/components/ProcurementCard'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function MonitorPCA() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    const ctrl = new AbortController()
    searchPncp({ q: 'contrato', tam_pagina: 20 }, ctrl.signal)
      .then((items) => {
        if (!ctrl.signal.aborted) setData(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  const filtered = q.trim()
    ? data.filter((p) =>
        `${p.title} ${p.orgao || ''} ${p.modalidade || ''}`.toLowerCase().includes(q.toLowerCase()),
      )
    : data

  function exportCsv() {
    const header = 'Título;Portal;UF;Órgão;Valor;Prazo;Status'
    const rows = filtered.map(
      (p) =>
        `"${p.title}";"${p.portal}";"${p.uf}";"${p.orgao || ''}";${p.valueBrl};"${p.deadline}";"${p.status}"`,
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `monitor-pca-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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
        <h2 className="text-base font-semibold text-[var(--text)]">Monitor PCA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhamento de licitações (dados reais da PNCP).
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar resultados..."
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        <span className="text-xs text-[var(--muted)]">
          {filtered.length} de {data.length} registros
        </span>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
        >
          Exportar CSV
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((p) => (
          <ProcurementCard key={p.id} procurement={p} showShare />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-8 text-center text-sm text-[var(--muted)]">
            Nenhum resultado encontrado.
          </p>
        )}
      </div>
    </div>
  )
}
