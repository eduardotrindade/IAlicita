'use client'

import { useCallback, useMemo, useState } from 'react'
import { ProcurementCard } from '@/components/ProcurementCard'
import { useFavoriteIds } from '@/hooks/useFavoriteIds'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

const ALL_UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

const ALL_PORTALS = ['PNCP', 'ComprasGov', 'Portal da Transparência', 'SIAG (MT)']

const EXTERNAL_PORTALS: Record<string, { nome: string; url: string }[]> = {
  MT: [
    {
      nome: 'SIAG (SEPLAG/MT)',
      url: 'https://aquisicoes.seplag.mt.gov.br/sgc/faces/pub/sgc/edlicitacoes/PropostaFornecedorEDLConsultaPageList.jsp',
    },
  ],
}

export default function Licitacoes() {
  const { toggle, isFavorite } = useFavoriteIds()
  const [q, setQ] = useState('')
  const [portal, setPortal] = useState('')
  const [uf, setUf] = useState('')
  const [tab, setTab] = useState<'todas' | 'escolhidas'>('todas')
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const fetchData = useCallback(async (query: string, portalFilter?: string, ufFilter?: string) => {
    setLoading(true)
    setSearched(true)
    const all: Procurement[] = []
    const activePortal = portalFilter || ''

    if (activePortal === 'SIAG (MT)') {
      setData(all)
      setLoading(false)
      return
    }

    try {
      if (!activePortal || activePortal === 'PNCP') {
        const items = await searchPncp({
          q: query.trim() || 'software',
          tam_pagina: 20,
          uf: ufFilter || undefined,
        })
        all.push(...items)
      }
      if (!activePortal || activePortal === 'ComprasGov') {
        try {
          const res = await fetch(
            `/api/compras-gov?q=${encodeURIComponent(query.trim() || 'software')}${ufFilter ? `&uf=${ufFilter}` : ''}`,
          )
          if (res.ok) {
            const json = await res.json()
            const rawList = Array.isArray(json.items)
              ? json.items
              : json._embedded?.licitacoes || []
            const comprasItems = rawList.map((l: Record<string, unknown>) => ({
              id: String(l.id || l.numeroControlePNCP || l.idCompra || ''),
              title: String(l.title || l.objeto || l.titulo || ''),
              description: String(l.description || l.objeto || ''),
              portal: 'ComprasGov Oficial',
              uf: String(l.uf || ufFilter || 'BR'),
              city: String(l.city || l.municipio || ''),
              valueBrl: Number(l.valueBrl || l.valor || 0),
              status: (l.status as Procurement['status']) || 'aberto',
              deadline: String(l.deadline || l.dataAbertura || l.dataPublicacao || ''),
              keywordsMatched: [] as string[],
              orgao: String(l.orgao || l.orgaoNome || ''),
              link: (l.link as string) || undefined,
              numeroControlePNCP: (l.numeroControlePNCP as string) || undefined,
            }))
            all.push(...comprasItems)
          }
        } catch {
          // ignore secondary portal errors
        }
      }
      if (!activePortal || activePortal === 'Portal da Transparência') {
        try {
          const res = await fetch(
            `/api/transparencia?q=${encodeURIComponent(query.trim() || 'software')}`,
          )
          if (res.ok) {
            const json = await res.json()
            const transparenciaItems = (json.items || json || []).map(
              (l: Record<string, unknown>) => ({
                id: String(l.id || l.codigo || ''),
                title: String(l.objeto || l.descricao || ''),
                description: String(l.descricao || ''),
                portal: 'Portal da Transparência',
                uf: String(l.uf || ''),
                city: String(l.municipio || ''),
                valueBrl: Number(l.valor || l.valorLicitação || 0),
                status: 'aberto' as const,
                deadline: String(l.dataResultado || l.dataPublicacao || ''),
                keywordsMatched: [] as string[],
                orgao: String(l.orgao || l.orgaoNome || ''),
              }),
            )
            all.push(...transparenciaItems)
          }
        } catch {
          // ignore secondary portal errors
        }
      }
      setData(all)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  const portals = ALL_PORTALS
  const ufs = ALL_UFS

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (tab === 'escolhidas' && !isFavorite(p.id)) return false
      if (portal && !p.portal.includes(portal)) return false
      if (uf && p.uf !== uf) return false
      return true
    })
  }, [data, portal, uf, tab, isFavorite])

  const handleSearch = useCallback(() => {
    fetchData(q, portal, uf)
  }, [q, portal, uf, fetchData])

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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
        className="flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
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
        <button
          type="submit"
          disabled={loading}
          className="self-end rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Pesquisar'}
        </button>
      </form>

      {uf && EXTERNAL_PORTALS[uf] && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Portais externos — {uf}
          </h3>
          <div className="flex flex-wrap gap-3">
            {EXTERNAL_PORTALS[uf].map((portal) => (
              <a
                key={portal.nome}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-4 py-2 text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>{portal.nome}</span>
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      {portal === 'SIAG (MT)' ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            SIAG (MT) — Consulta direta no portal
          </h3>
          <p className="mb-4 text-sm text-[var(--muted)]">
            Use o formulário abaixo para pesquisar licitações diretamente no sistema SIAG do Mato
            Grosso.
          </p>
          <iframe
            src="https://aquisicoes.seplag.mt.gov.br/licitacao-pub/#/consulta-licitacoes"
            className="h-[700px] w-full rounded-lg border border-[var(--border)]"
            sandbox="allow-scripts allow-forms allow-same-origin"
            title="SIAG - Consulta de Licitações"
          />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-2 animate-pulse p-8 text-center text-[var(--brand)]">
              Buscando na API do Governo Federal (PNCP)...
            </div>
          ) : !searched ? (
            <p className="col-span-2 py-8 text-center text-sm text-[var(--muted)]">
              Digite um termo e clique em <strong>Pesquisar</strong> para buscar licitações na PNCP.
            </p>
          ) : filtered.length === 0 ? (
            <p className="col-span-2 py-8 text-center text-sm text-[var(--muted)]">
              Nenhum resultado encontrado. Tente outros termos de busca.
            </p>
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
      )}
    </div>
  )
}
