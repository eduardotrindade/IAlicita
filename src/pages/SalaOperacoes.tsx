import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl } from '../utils/format'
import type { Procurement } from '../types'

export function SalaOperacoes() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    searchPncp({ q: 'pregão', tam_pagina: 20 }, controller.signal)
      .then(items => {
        if (!controller.signal.aborted) {
          setData(items.filter((p) => p.status === 'aberto' || p.status === 'em_andamento'))
          setLoading(false)
        }
      })
      .catch(() => { if (!controller.signal.aborted) { setError('Falha ao carregar pregões'); setLoading(false) } })
    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando pregões da PNCP...</p>
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

  const abertos = data.filter((p) => p.status === 'aberto')
  const andamento = data.filter((p) => p.status === 'em_andamento')

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Sala de Operações (Ao Vivo)
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Licitações abertas e em andamento na PNCP.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text)]">Abertas ({abertos.length})</h3>
          {abertos.slice(0, 5).map((p) => (
            <div key={p.id} className="rounded border border-[var(--brand)] bg-[var(--surface-hover)] p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm text-[var(--text)] truncate">{p.title}</h3>
                  <p className="text-xs text-[var(--muted)]">{p.orgao || p.portal}</p>
                </div>
                <span className="ml-2 text-[10px] uppercase font-bold text-white bg-green-600 px-2 py-0.5 rounded shrink-0">Aberta</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[var(--surface)] p-2 rounded">
                  <span className="text-[var(--muted)] block">Valor Estimado</span>
                  <strong className="text-[var(--text)]">{formatBrl(p.valueBrl)}</strong>
                </div>
                <div className="bg-[var(--surface)] p-2 rounded">
                  <span className="text-[var(--muted)] block">UF</span>
                  <strong className="text-[var(--text)]">{p.uf} {p.city ? `- ${p.city}` : ''}</strong>
                </div>
              </div>
            </div>
          ))}
          {abertos.length === 0 ? <p className="text-xs text-[var(--muted)]">Nenhuma licitação aberta no momento.</p> : null}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text)]">Em Andamento ({andamento.length})</h3>
          {andamento.slice(0, 5).map((p) => (
            <div key={p.id} className="rounded border border-amber-500 bg-[var(--surface-hover)] p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm text-[var(--text)] truncate">{p.title}</h3>
                  <p className="text-xs text-[var(--muted)]">{p.orgao || p.portal}</p>
                </div>
                <span className="ml-2 text-[10px] uppercase font-bold text-white bg-amber-600 px-2 py-0.5 rounded shrink-0">Em Andamento</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[var(--surface)] p-2 rounded">
                  <span className="text-[var(--muted)] block">Valor Estimado</span>
                  <strong className="text-[var(--text)]">{formatBrl(p.valueBrl)}</strong>
                </div>
                <div className="bg-[var(--surface)] p-2 rounded">
                  <span className="text-[var(--muted)] block">Modalidade</span>
                  <strong className="text-[var(--text)]">{p.modalidade || p.uf}</strong>
                </div>
              </div>
            </div>
          ))}
          {andamento.length === 0 ? <p className="text-xs text-[var(--muted)]">Nenhuma licitação em andamento.</p> : null}
        </div>
      </div>
    </div>
  )
}
