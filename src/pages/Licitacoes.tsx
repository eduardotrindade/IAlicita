import { useMemo, useState, useEffect } from 'react'
import { MOCK_PROCUREMENTS } from '../data/mockData'
import { useFavoriteIds } from '../hooks/useFavoriteIds'
import { ProcurementCard } from '../components/ProcurementCard'
import { searchPncp, PncpItem } from '../services/pncpApi'

export function Licitacoes() {
  const { toggle, isFavorite } = useFavoriteIds()
  const [q, setQ] = useState('')
  const [portal, setPortal] = useState('')
  const [uf, setUf] = useState('')
  const [tab, setTab] = useState<'todas' | 'escolhidas' | 'pncp_vivo'>('todas')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pncpData, setPncpData] = useState<any[]>([])
  const [loadingPncp, setLoadingPncp] = useState(false)

  // Efeito disparado na aba do PNCP
  useEffect(() => {
    if (tab === 'pncp_vivo') {
      const delay = setTimeout(() => {
        setLoadingPncp(true)
        searchPncp(q).then((items) => {
          const adapted = items.map((i: PncpItem) => ({
             id: i.id || String(Math.random()),
             title: i.objetoCompra || 'Edital Governo Federal',
             portal: 'Compras.gov/PNCP',
             uf: 'BR',
             publishedAt: i.dataPublicacaoPncp?.split('T')[0] || 'Recente',
             closeAt: i.modalidadeNome || 'Consulta',
             value: i.valorTotalEstimado || 0,
             valueBrl: `R$ ${i.valorTotalEstimado || 0}`,
             status: 'Em Aberto',
             deadline: 'Ver edital',
             keywordsMatched: ['Ao Vivo', i.orgaoEntidade?.nome || '']
          }))
          setPncpData(adapted)
        }).finally(() => setLoadingPncp(false))
      }, 600)
      return () => clearTimeout(delay)
    }
  }, [tab, q])

  const portals = useMemo(() => {
    const s = new Set(MOCK_PROCUREMENTS.map((p) => p.portal))
    return [...s].sort()
  }, [])

  const ufs = useMemo(() => {
    const s = new Set(MOCK_PROCUREMENTS.map((p) => p.uf))
    return [...s].sort()
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return MOCK_PROCUREMENTS.filter((p) => {
      if (tab === 'escolhidas' && !isFavorite(p.id)) return false
      if (portal && p.portal !== portal) return false
      if (uf && p.uf !== uf) return false
      if (qq) {
        const blob = `${p.title} ${p.keywordsMatched.join(' ')} ${p.portal}`.toLowerCase()
        if (!blob.includes(qq)) return false
      }
      return true
    })
  }, [q, portal, uf, tab, isFavorite])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-[var(--text)]">Buscas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Busque licitações e oportunidades, marque as escolhidas e compartilhe por
          WhatsApp ou Telegram.
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
        <button
          type="button"
          className={`border-b-2 px-3 py-2 text-sm font-bold ${
            tab === 'pncp_vivo'
              ? 'border-red-500 text-red-500 animate-pulse'
              : 'border-transparent text-[var(--muted)] hover:text-red-400'
          }`}
          onClick={() => setTab('pncp_vivo')}
        >
          PNCP (Ao Vivo) 🔴
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
        {loadingPncp ? (
           <div className="p-8 text-center text-[var(--brand)] animate-pulse col-span-2">
             Buscando na API do Governo Federal (PNCP) em {import.meta.env.VITE_PNCP_BASE_URL}...
           </div>
        ) : (
          (tab === 'pncp_vivo' ? pncpData : filtered).map((p) => (
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

      {!loadingPncp && (tab === 'pncp_vivo' ? pncpData : filtered).length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Nenhum resultado. Ajuste os filtros ou aguarde a conexão.
        </p>
      ) : null}
    </div>
  )
}
