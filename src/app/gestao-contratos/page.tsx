'use client'

import { useEffect, useState } from 'react'
import { formatBrl, formatDatePt } from '@/lib/format'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function GestaoContratos() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    searchPncp({ q: 'contrato', tam_pagina: 30 }, ctrl.signal)
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
        <h2 className="text-base font-semibold text-[var(--text)]">Gestão de Contratos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhamento de contratos públicos (dados da PNCP).
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Total de registros
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">{data.length}</p>
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
            Homologados
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-blue-400">
            {data.filter((p) => p.status === 'homologado').length}
          </p>
        </div>
      </div>

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
                Publicação
              </th>
              <th className="p-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
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
                  {p.dataPublicacao ? formatDatePt(p.dataPublicacao) : '—'}
                </td>
                <td className="p-3 text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      p.status === 'homologado'
                        ? 'bg-blue-900/30 text-blue-400'
                        : p.status === 'aberto'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-gray-700/30 text-gray-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
