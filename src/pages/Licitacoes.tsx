import { useMemo, useState, useEffect, useCallback } from 'react'
import { useFavoriteIds } from '../hooks/useFavoriteIds'
import { ProcurementCard } from '../components/ProcurementCard'
import { searchPncp } from '../services/pncpApi'
import type { Procurement } from '../types'

export function Licitacoes() {
  const { toggle, isFavorite } = useFavoriteIds()
  const [q, setQ] = useState('')
  const [portal, setPortal] = useState('')
  const [uf, setUf] = useState('')
  const [tab, setTab] = useState<'todas' | 'escolhidas'>('todas')
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (query: string) => {
    setLoading(true)
    const items = await searchPncp({ q: query || 'software', tam_pagina: 30 })
    setData(items)
    setLoading(false)
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => fetchData(q), 600)
    return () => clearTimeout(delay)
  }, [q, fetchData])

  const portals = useMemo(() => {
    const s = new Set(data.map((p) => p.portal).filter(Boolean))
    return [...s].sort()
  }, [data])

  const ufs = useMemo(() => {
    const s = new Set(data.map((p) => p.uf).filter(Boolean))
    return [...s].sort()
  }, [data])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return data.filter((p) => {
      if (tab === 'escolhidas' && !isFavorite(p.id)) return false
      if (portal && p.portal !== portal) return false
      if (uf && p.uf !== uf) return false
      if (qq) {
        const blob = `${p.title} ${p.keywordsMatched.join(' ')} ${p.portal} ${p.orgao || ''}`.toLowerCase()
        if (!blob.includes(qq)) return false
      }
      return true
    })
  }, [data, q, portal, uf, tab, isFavorite])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-[var(--text)]">
          Buscas <span className="text-xs font-normal text-[var(--muted)]">PNCP (Ao Vivo)</span>
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Resultados reais da API do Portal Nacional de Contratações Públicas.
        </p>
      </div>

      <div className="flex gap-2 border-b border-[var(--border)]">
        <button
          type="button"
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === 'todas'
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          onClick={() => setTab('todas')}
        >
          Todas
        </button>
        <button
          type="button"
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === 'escolhidas'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          onClick={() => setTab('escolhidas')}
        >
          Escolhidas ★
        </button>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Busca
          <input
            type="search"
            placeholder="Título ou palavra-chave…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Portal
          <select
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
            value={portal}
            onChange={(e) => setPortal(e.target.value)}
          >
            <option value="">Todos</option>
            {portals.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          UF
          <select
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
          >
            <option value="">Todas</option>
            {ufs.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <div className="p-8 text-center text-[var(--brand)] animate-pulse col-span-2">
            Buscando na API do Governo Federal (PNCP)...
          </div>
        ) : (
          filtered.map((p) => (
            <ProcurementCard
              key={p.id}
              procurement={p}
              favorite={isFavorite(p.id)}
              onToggleFavorite={() => toggle(p.id)}
              showShare
            />
          ))
        )}
      </div>

      {!loading && filtered.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Nenhum resultado encontrado na PNCP. Tente outros termos de busca.
        </p>
      ) : null}
    </div>
  )
}
