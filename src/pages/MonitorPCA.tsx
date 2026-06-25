import { useState } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl } from '../utils/format'
import type { Procurement } from '../types'

export function MonitorPCA() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [query, setQuery] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setSearched(true)
    const items = await searchPncp({ q, tam_pagina: 50 })
    setData(items)
    setLoading(false)
  }

  function downloadCsv() {
    if (!data.length) return
    const headers = ['Órgão', 'Objeto', 'Valor (R$)', 'UF', 'Cidade', 'Situação', 'Publicação']
    const rows = data.map((i) => [
      i.orgao || '',
      i.title,
      i.valueBrl,
      i.uf,
      i.city || '',
      i.situacao || i.status,
      i.dataPublicacao || '',
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pncp_${query.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Monitor PCA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Busque licitações por termo ou cidade na PNCP.
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cidade, órgão ou palavra-chave..."
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        {data.length > 0 && (
          <button
            type="button"
            onClick={downloadCsv}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--brand)]"
          >
            ↓ CSV
          </button>
        )}
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-[var(--muted)] animate-pulse">Buscando na PNCP...</p>
        </div>
      ) : searched && data.length === 0 ? (
        <p className="text-sm text-[var(--muted)] py-10 text-center">Nenhum resultado encontrado.</p>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-hover)] text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Órgão</th>
                <th className="px-4 py-3 font-medium">Objeto</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">UF</th>
                <th className="px-4 py-3 font-medium">Cidade</th>
                <th className="px-4 py-3 font-medium">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data.map((i) => (
                <tr key={i.id} className="hover:bg-[var(--surface-hover)]">
                  <td className="px-4 py-3 text-[var(--text)] max-w-[10rem] truncate">{i.orgao || i.portal}</td>
                  <td className="px-4 py-3 text-[var(--text)] max-w-[14rem] truncate">{i.title}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{formatBrl(i.valueBrl)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{i.uf}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{i.city || '-'}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      i.status === 'aberto' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      i.status === 'em_andamento' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      i.status === 'homologado' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {i.status === 'aberto' ? 'Aberta' : i.status === 'em_andamento' ? 'Em Andamento' : i.status === 'homologado' ? 'Homologada' : i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
