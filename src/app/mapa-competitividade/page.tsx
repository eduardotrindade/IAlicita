'use client'

import { useState } from 'react'
import { formatBrl } from '@/lib/format'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function MapaCompetitividade() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  async function handleSearch() {
    setLoading(true)
    const items = await searchPncp({ q: q || 'serviço', tam_pagina: 20 })
    setData(items)
    setLoading(false)
  }

  const byOrgao = data.reduce<Record<string, { count: number; totalValue: number }>>((acc, p) => {
    const key = p.orgao || p.portal || 'Desconhecido'
    if (!acc[key]) acc[key] = { count: 0, totalValue: 0 }
    acc[key].count++
    acc[key].totalValue += p.valueBrl
    return acc
  }, {})

  const orgaosOrdenados = Object.entries(byOrgao).sort((a, b) => b[1].count - a[1].count)

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Mapa de Competitividade</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Análise de órgãos e concentração de licitações (PNCP).
        </p>
      </header>

      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Termo de busca
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="serviço, obra, tecnologia..."
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="self-end rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Analisar'}
        </button>
      </div>

      {data.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Total licitações
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
                {data.length}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Órgãos distintos
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
                {Object.keys(byOrgao).length}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Valor total
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
                {formatBrl(data.reduce((s, p) => s + p.valueBrl, 0))}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Órgão
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Licitações
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Valor Total
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Ticket Médio
                  </th>
                </tr>
              </thead>
              <tbody>
                {orgaosOrdenados.map(([orgao, info]) => (
                  <tr
                    key={orgao}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)]"
                  >
                    <td className="p-3 text-[var(--text)]">{orgao}</td>
                    <td className="p-3 text-right font-mono text-xs text-[var(--text)]">
                      {info.count}
                    </td>
                    <td className="p-3 text-right font-mono text-xs text-[var(--text)]">
                      {formatBrl(info.totalValue)}
                    </td>
                    <td className="p-3 text-right font-mono text-xs text-[var(--muted)]">
                      {formatBrl(Math.round(info.totalValue / info.count))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && data.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--muted)]">
          Faça uma busca para ver a análise de competitividade.
        </p>
      )}
    </div>
  )
}
