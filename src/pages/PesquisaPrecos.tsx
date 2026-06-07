import { useState } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl } from '../utils/format'

export function PesquisaPrecos() {
  const [item, setItem] = useState('')
  const [results, setResults] = useState<{ min: number; avg: number; max: number; count: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item.trim()) return
    setLoading(true)
    const data = await searchPncp({ q: item, tam_pagina: 30 })
    if (data.length > 0) {
      const values = data.map((p) => p.valueBrl).filter((v) => v > 0)
      if (values.length > 0) {
        setResults({
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((s, v) => s + v, 0) / values.length,
          count: values.length,
        })
      } else {
        setResults({ min: 0, avg: 0, max: 0, count: 0 })
      }
    } else {
      setResults(null)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Pesquisa de Preços</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Estimativas calculadas a partir de licitações reais da PNCP.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-[var(--text)]">Pesquisar Item</h3>
          <form onSubmit={handleSearch} className="space-y-3">
            <input
              className="block w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
              placeholder="Ex: Firewall, software, servidor..."
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar na PNCP'}
            </button>
          </form>
        </div>

        <div className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-[var(--text)] mb-4">
            {results ? `Média de Mercado — "${item}"` : 'Média de Mercado'}
          </h3>
          {results ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--surface-hover)] p-3 rounded-lg text-center">
                <p className="text-xs text-[var(--muted)]">Menor Preço</p>
                <p className="font-semibold text-[var(--text)] mt-1">{formatBrl(results.min)}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-800 dark:text-blue-300">Preço Médio</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100 mt-1">{formatBrl(results.avg)}</p>
              </div>
              <div className="bg-[var(--surface-hover)] p-3 rounded-lg text-center">
                <p className="text-xs text-[var(--muted)]">Maior Preço</p>
                <p className="font-semibold text-[var(--text)] mt-1">{formatBrl(results.max)}</p>
              </div>
              <div className="col-span-3 text-center text-xs text-[var(--muted)]">
                Baseado em {results.count} licitação{(results.count) !== 1 ? 'ões' : ''} da PNCP
                {results.count === 0 ? ' (sem valores disponíveis)' : ''}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] text-center py-8">
              {loading ? '' : 'Pesquise um item acima para ver estimativas de preços baseadas em licitações reais.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
