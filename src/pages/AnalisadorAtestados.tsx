import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import type { Procurement } from '../types'

export function AnalisadorAtestados() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    searchPncp({ q: 'serviço', tam_pagina: 20 }, controller.signal)
      .then(items => { if (!controller.signal.aborted) { setData(items); setLoading(false) } })
      .catch(() => { if (!controller.signal.aborted) { setError('Falha ao carregar dados'); setLoading(false) } })
    return () => controller.abort()
  }, [])

  const totalValue = data.reduce((s, p) => s + p.valueBrl, 0)
  const abertas = data.filter(p => p.status === 'aberto')
  const homologadas = data.filter(p => p.status === 'homologado')

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Analisador de Atestados de Capacidade Técnica</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">O edital pede 30%? Descubra se os seus atestados suprem a soma de requisitos.</p>
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
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-[var(--text)] mb-4">Resumo dos Dados Reais</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text)] font-medium">Total de licitações analisadas</span>
                  <span className="text-green-600 font-semibold">{data.length} registros</span>
                </div>
                <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text)] font-medium">Valor total estimado</span>
                  <span className="text-[var(--text)] font-semibold">R$ {(totalValue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (totalValue / 100000000) * 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text)] font-medium">Abertas vs Homologadas</span>
                  <span className="text-amber-600 font-semibold">{abertas.length} abertas / {homologadas.length} homologadas</span>
                </div>
                <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ width: `${data.length > 0 ? (homologadas.length / data.length) * 100 : 0}%` }}></div>
                  <div className="h-full bg-amber-500" style={{ width: `${data.length > 0 ? (abertas.length / data.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-[var(--text)] mb-4">Licitações Recentes (PNCP)</h3>
            <div className="space-y-3">
              {data.slice(0, 5).map(p => (
                <div key={p.id} className="flex justify-between items-center text-xs border-b border-[var(--border)] pb-2 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-[var(--text)] font-medium truncate">{p.title}</p>
                    <p className="text-[var(--muted)]">{p.orgao || p.portal} • {p.uf}</p>
                  </div>
                  <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    p.status === 'aberto' ? 'bg-green-100 text-green-800' :
                    p.status === 'homologado' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
