import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import type { Procurement } from '../types'

export function RoboLances() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    searchPncp({ q: 'pregão', tam_pagina: 10 }, controller.signal)
      .then(items => {
        if (!controller.signal.aborted) {
          setData(items.filter(p => p.status === 'aberto' || p.status === 'em_andamento'))
          setLoading(false)
        }
      })
      .catch(() => { if (!controller.signal.aborted) { setError('Falha ao carregar pregões'); setLoading(false) } })
    return () => controller.abort()
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Agente Autônomo de Disputa (Robô de Lances)</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Configure os parâmetros da IA para cobrir lances na Sala de Operações automaticamente.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-[var(--muted)] animate-pulse">Carregando pregões da PNCP...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-[var(--text)]">Estratégia do Robô</h3>

            <div>
              <label htmlFor="limite-margem" className="block text-xs text-[var(--text)] mb-1">Limite Mínimo de Margem (R$)</label>
              <input id="limite-margem" type="text" className="w-full rounded border border-[var(--border)] bg-[var(--surface)] p-2 text-sm text-[var(--text)]" defaultValue="80.000,00" />
            </div>

            <div>
              <label htmlFor="intervalo-desconto" className="block text-xs text-[var(--text)] mb-1">Intervalo de Desconto (%)</label>
              <select id="intervalo-desconto" className="w-full rounded border border-[var(--border)] bg-[var(--surface)] p-2 text-sm text-[var(--text)]">
                 <option>Cobrir em 0,5% o menor lance</option>
                 <option>Cobrir em 1,0% o menor lance</option>
                 <option>Apenas empatar se ME/EPP</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                <input type="checkbox" defaultChecked className="rounded text-[var(--brand)]" />
                Derrubar lance agressivamente nos 30s finais
              </label>
            </div>
          </div>

          <div className="rounded border border-green-500 bg-green-50 dark:bg-green-900/10 p-5 shadow-sm">
            <p className="text-green-800 dark:text-green-300 font-bold mb-2">STATUS: PREGÕES DISPONÍVEIS</p>
            <p className="text-xs text-green-700 dark:text-green-400 mb-4">
              {data.length} pregão(ões) aberto(s) ou em andamento na PNCP.
            </p>
            <div className="space-y-2">
              {data.slice(0, 3).map(p => (
                <div key={p.id} className="bg-white dark:bg-green-950/30 rounded p-2 text-xs">
                  <p className="font-medium text-green-900 dark:text-green-200 truncate">{p.title}</p>
                  <p className="text-green-600 dark:text-green-400">{p.orgao || p.portal} • {p.uf}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
