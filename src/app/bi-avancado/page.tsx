'use client'

import { useEffect, useState } from 'react'
import { countByUf } from '@/lib/countByUf'
import { formatBrl } from '@/lib/format'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function BiAvancado() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    searchPncp({ q: 'serviço', tam_pagina: 50 }, ctrl.signal)
      .then((items) => {
        if (!ctrl.signal.aborted) setData(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  const totalValue = data.reduce((s, p) => s + p.valueBrl, 0)
  const byUf = countByUf(data)
  const top5 = Object.entries(byUf)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const byStatus = {
    aberto: data.filter((p) => p.status === 'aberto').length,
    em_andamento: data.filter((p) => p.status === 'em_andamento').length,
    homologado: data.filter((p) => p.status === 'homologado').length,
    cancelado: data.filter((p) => p.status === 'cancelado').length,
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
        <h2 className="text-base font-semibold text-[var(--text)]">BI Avançado</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Indicadores e métricas baseados em dados reais da PNCP.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Total</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">{data.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Valor total
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-[var(--text)]">
            {formatBrl(totalValue)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Ticket médio
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-[var(--text)]">
            {data.length > 0 ? formatBrl(Math.round(totalValue / data.length)) : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            UFs cobertas
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
            {Object.keys(byUf).length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">Distribuição por Status</h3>
          <div className="space-y-2">
            {Object.entries(byStatus).map(([status, count]) => {
              const pct = data.length > 0 ? (count / data.length) * 100 : 0
              return (
                <div key={status} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-xs text-[var(--muted)]">
                    {status === 'em_andamento'
                      ? 'Em andamento'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <div className="flex-1 rounded-full bg-[var(--border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--accent)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-xs text-[var(--text)]">
                    {count} ({Math.round(pct)}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">Top 5 UFs</h3>
          <div className="space-y-2">
            {top5.map(([uf, count]) => {
              const maxCount = top5[0]?.[1] || 1
              const pct = (count / maxCount) * 100
              return (
                <div key={uf} className="flex items-center gap-3 text-sm">
                  <span className="w-10 text-xs font-bold text-[var(--text)]">{uf}</span>
                  <div className="flex-1 rounded-full bg-[var(--border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--brand)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-xs text-[var(--text)]">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
