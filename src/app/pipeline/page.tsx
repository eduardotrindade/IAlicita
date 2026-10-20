'use client'

import { useEffect, useState } from 'react'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

const statusOrder: Procurement['status'][] = [
  'aberto',
  'em_andamento',
  'homologado',
  'deserto',
  'cancelado',
]

const statusColors: Record<Procurement['status'], string> = {
  aberto: 'border-l-green-500',
  em_andamento: 'border-l-yellow-500',
  homologado: 'border-l-blue-500',
  deserto: 'border-l-red-500',
  cancelado: 'border-l-gray-500',
}

export default function Pipeline() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    searchPncp({ q: 'serviço', tam_pagina: 30 }, ctrl.signal)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  const grouped = statusOrder.map((status) => ({
    status,
    items: data.filter((p) => p.status === status),
  }))

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
        <h2 className="text-base font-semibold text-[var(--text)]">Pipeline</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhamento visual do fluxo de licitações (dados reais da PNCP).
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {grouped.map(({ status, items }) => (
          <div
            key={status}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {status === 'em_andamento'
                ? 'Em andamento'
                : status.charAt(0).toUpperCase() + status.slice(1)}{' '}
              ({items.length})
            </h3>
            <div className="space-y-2">
              {items.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-xs border-l-4 ${statusColors[p.status]}`}
                >
                  <p className="font-medium text-[var(--text)] truncate">{p.title}</p>
                  <p className="mt-1 text-[var(--muted)]">
                    {p.orgao || p.portal} · {p.uf}
                  </p>
                </div>
              ))}
              {items.length === 0 && (
                <p className="py-4 text-center text-xs text-[var(--muted)]">Nenhum item</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
