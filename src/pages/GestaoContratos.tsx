import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl, formatDatePt } from '../utils/format'
import type { Procurement } from '../types'

export function GestaoContratos() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchPncp({ q: 'contrato', tam_pagina: 30 }).then((items) => {
      setData(items.filter((p) => p.status === 'homologado' || p.status === 'em_andamento'))
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando contratos da PNCP...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Gestão de Contratos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Licitações homologadas e em andamento na PNCP.</p>
      </header>
      <div className="grid gap-4">
        {data.slice(0, 10).map((c) => (
          <div key={c.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-[var(--text)]">{c.title}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{c.orgao || c.portal} • {c.uf}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-md shrink-0 ml-2 ${
                c.status === 'homologado'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                {c.status === 'homologado' ? 'Homologado' : 'Em Andamento'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-[var(--muted)]">Valor</p>
                <p className="font-medium text-[var(--text)]">{formatBrl(c.valueBrl)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Publicação</p>
                <p className="font-medium text-[var(--text)]">{c.dataPublicacao ? formatDatePt(c.dataPublicacao) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Modalidade</p>
                <p className="font-medium text-[var(--text)]">{c.modalidade || '—'}</p>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nenhum contrato encontrado.</p>
        ) : null}
      </div>
    </div>
  )
}
