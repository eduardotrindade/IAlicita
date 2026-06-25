import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl } from '../utils/format'
import type { Procurement } from '../types'

const COLUMNS = [
  { key: 'aberto', label: 'Abertas' },
  { key: 'em_andamento', label: 'Em Andamento' },
  { key: 'homologado', label: 'Homologadas' },
  { key: 'cancelado', label: 'Canceladas' },
  { key: 'deserto', label: 'Desertas' },
] as const

export function Pipeline() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    searchPncp({ q: 'serviço', tam_pagina: 40 }, controller.signal)
      .then(items => { if (!controller.signal.aborted) { setData(items); setLoading(false) } })
      .catch(() => { if (!controller.signal.aborted) { setError('Falha ao carregar pipeline'); setLoading(false) } })
    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando pipeline...</p>
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
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">
          Pipeline Visual de Licitações
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhe os certames por status na PNCP.
        </p>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const items = data.filter((p) => p.status === col.key)
          return (
            <div
              key={col.key}
              className="flex w-72 flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text)]">{col.label}</h3>
                <span className="rounded bg-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--muted)]">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {items.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className="cursor-default space-y-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm hover:border-[var(--brand)]"
                  >
                    <p className="line-clamp-2 text-xs font-medium leading-tight text-[var(--text)]">
                      {p.title}
                    </p>
                    <div className="flex justify-between text-xs text-[var(--muted)]">
                      <span className="truncate max-w-[8rem]">{p.orgao || p.portal}</span>
                      <span>{p.uf}</span>
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      {formatBrl(p.valueBrl)}
                    </div>
                  </div>
                ))}
                {items.length === 0 ? (
                  <p className="text-xs text-[var(--muted)] py-4 text-center">Nenhum certame</p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
