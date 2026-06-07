import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl } from '../utils/format'
import type { Procurement } from '../types'

export function MonitorPCA() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchPncp({ q: 'contratação', tam_pagina: 30 }).then((items) => {
      setData(items)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando PCA da PNCP...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Monitor PCA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Plano de Contratações Anual — dados reais da PNCP.
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[var(--surface-hover)] text-xs uppercase text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Órgão</th>
              <th className="px-4 py-3 font-medium">Objeto</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">UF</th>
              <th className="px-4 py-3 font-medium">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {data.slice(0, 15).map((i) => (
              <tr key={i.id} className="hover:bg-[var(--surface-hover)]">
                <td className="px-4 py-3 text-[var(--text)] max-w-[10rem] truncate">{i.orgao || i.portal}</td>
                <td className="px-4 py-3 text-[var(--text)] max-w-[14rem] truncate">{i.title}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{formatBrl(i.valueBrl)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{i.uf}</td>
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
    </div>
  )
}
