'use client'

import { useEffect, useState } from 'react'
import type { Procurement } from '@/types'
import { CEF_PORTAL_URL } from '@/lib/caixaLicitacoes'

export default function CaixaLicitacoesPage() {
  const [items, setItems] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/caixa?q=${encodeURIComponent(searchTerm)}`)
        const data = await res.json()
        if (Array.isArray(data?.items)) {
          setItems(data.items)
        }
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchTerm])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Licitações CAIXA (SICVE)
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Integração com o Portal de Licitações da Caixa Econômica Federal (CNPJ: 00.360.305/0001-04)
            </p>
          </div>
          <a
            href={CEF_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            Acessar SICVE Caixa ↗
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por objeto, número ou palavra-chave (ex: software, segurança)..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Certame / Órgão</th>
              <th className="px-4 py-3">Objeto da Licitação</th>
              <th className="px-4 py-3">Valor Estimado</th>
              <th className="px-4 py-3">Vigência / Prazo</th>
              <th className="px-4 py-3 text-right">Link Direto SICVE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  Consultando licitações da Caixa Econômica Federal...
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[var(--surface-hover)]">
                  <td className="px-4 py-3 font-medium text-[var(--text)]">
                    <p className="font-mono text-xs text-[var(--accent)]">{item.id}</p>
                    <p className="text-[11px] text-[var(--muted)]">{item.orgao || 'CAIXA ECONÔMICA FEDERAL'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{item.title}</p>
                    <p className="text-xs text-[var(--muted)] line-clamp-1">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">
                    {item.valueBrl ? `R$ ${item.valueBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informado'}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {item.deadline}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={item.link || CEF_PORTAL_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:opacity-80"
                    >
                      Abrir SICVE ↗
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  Nenhuma licitação encontrada para a busca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
