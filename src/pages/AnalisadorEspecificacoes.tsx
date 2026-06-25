import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import type { Procurement } from '../types'

export function AnalisadorEspecificacoes() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    searchPncp({ q: 'tecnologia', tam_pagina: 20 }, controller.signal)
      .then(items => { if (!controller.signal.aborted) { setData(items); setLoading(false) } })
      .catch(() => { if (!controller.signal.aborted) { setError('Falha ao carregar dados'); setLoading(false) } })
    return () => controller.abort()
  }, [])

  const comModalidade = data.filter(p => p.modalidade)
  const modalidades = [...new Set(comModalidade.map(p => p.modalidade))]

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Analisador de Especificações Técnicas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Análise de modalidades e critérios das licitações reais da PNCP.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-[var(--muted)] animate-pulse">Carregando dados da PNCP...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Modalidades Encontradas</h3>
              <div className="space-y-2">
                {modalidades.slice(0, 6).map(m => {
                  const count = comModalidade.filter(p => p.modalidade === m).length
                  return (
                    <div key={m} className="flex justify-between items-center text-xs">
                      <span className="text-[var(--text)]">{m}</span>
                      <span className="font-mono text-[var(--muted)]">{count} ocorrências</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Resumo</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Total analisadas</span>
                  <span className="text-[var(--text)] font-semibold">{data.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Com modalidade definida</span>
                  <span className="text-[var(--text)] font-semibold">{comModalidade.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Modalidades únicas</span>
                  <span className="text-[var(--text)] font-semibold">{modalidades.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-[var(--text)] mb-4">Licitações com Especificações (PNCP)</h3>
            <div className="space-y-3">
              {data.slice(0, 6).map(p => (
                <div key={p.id} className="border-b border-[var(--border)] pb-3 last:border-0">
                  <p className="text-xs font-medium text-[var(--text)] truncate">{p.title}</p>
                  <p className="text-[10px] text-[var(--muted)] mt-1">
                    {p.modalidade || '—'} • {p.orgao || p.portal} • {p.uf}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
