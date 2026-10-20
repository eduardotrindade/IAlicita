'use client'

import { useEffect, useState } from 'react'
import { formatBrl, formatDatePt } from '@/lib/format'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function SalaOperacoes() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    searchPncp({ q: 'pregão', tam_pagina: 30 }, ctrl.signal)
      .then((items) => {
        if (!ctrl.signal.aborted) setData(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  const abertos = data.filter((p) => p.status === 'aberto')
  const proximos = abertos
    .filter((p) => p.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

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
        <h2 className="text-base font-semibold text-[var(--text)]">Sala de Operações (Lances)</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhamento de pregões e licitações abertas (dados reais da PNCP).
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Total</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">{data.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Abertos</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-green-400">{abertos.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Em andamento
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-yellow-400">
            {data.filter((p) => p.status === 'em_andamento').length}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Valor total
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-[var(--text)]">
            {formatBrl(data.reduce((s, p) => s + p.valueBrl, 0))}
          </p>
        </div>
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Próximos prazos</h3>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Título
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Órgão
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  UF
                </th>
                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Valor
                </th>
                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Prazo
                </th>
              </tr>
            </thead>
            <tbody>
              {proximos.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)]"
                >
                  <td className="p-3 text-[var(--text)]">{p.title}</td>
                  <td className="p-3 text-xs text-[var(--muted)]">{p.orgao || '—'}</td>
                  <td className="p-3 text-xs text-[var(--muted)]">{p.uf}</td>
                  <td className="p-3 text-right font-mono text-xs text-[var(--text)]">
                    {formatBrl(p.valueBrl)}
                  </td>
                  <td className="p-3 text-right text-xs text-[var(--muted)]">
                    {formatDatePt(p.deadline)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
