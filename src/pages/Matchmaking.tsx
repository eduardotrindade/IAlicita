import { useState, useEffect, useCallback } from 'react'
import { ProcurementCard } from '../components/ProcurementCard'
import { searchPncp } from '../services/pncpApi'
import { lookupCnpj } from '../services/cnpjApi'
import type { Procurement, CnpjData } from '../types'

export function Matchmaking() {
  const [cnpj, setCnpj] = useState('')
  const [cnpjData, setCnpjData] = useState<CnpjData | null>(null)
  const [procurements, setProcurements] = useState<Procurement[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) {
      setError('CNPJ deve ter 14 dígitos')
      return
    }
    setIsSearching(true)

    const [cnpjResult, pncpResult] = await Promise.all([
      lookupCnpj(digits),
      searchPncp({ q: 'tecnologia', tam_pagina: 20 }),
    ])

    if (cnpjResult) setCnpjData(cnpjResult)
    else setError('CNPJ não encontrado na ReceitaWS')
    setProcurements(pncpResult)
    setIsSearching(false)
  }, [cnpj])

  useEffect(() => {
    if (!cnpjData) return
    const atividade = (cnpjData.atividade_principal?.text || '').toLowerCase()
    if (!atividade) return
    const words = atividade.split(/\s+/).filter((w) => w.length > 3)
    if (words.length > 0) {
      searchPncp({ q: words.slice(0, 3).join(' '), tam_pagina: 15 }).then(setProcurements)
    }
  }, [cnpjData])

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Matchmaking Inteligente</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Descubra oportunidades compatíveis com seu CNPJ via ReceitaWS + PNCP.
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex max-w-md flex-col gap-3">
        <div className="flex gap-3">
          <input
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            placeholder="Digite o CNPJ (apenas números)"
          />
          <button
            type="submit"
            className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
          >
            Analisar
          </button>
        </div>
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </form>

      {cnpjData ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="text-sm font-semibold text-[var(--text)]">{cnpjData.nome}</h3>
          <p className="text-xs text-[var(--muted)]">
            {cnpjData.fantasia ? `${cnpjData.fantasia} • ` : ''}
            {cnpjData.atividade_principal?.text || ''} • {cnpjData.endereco.uf} • {cnpjData.situacao}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
            <span className="rounded bg-[var(--surface-hover)] px-2 py-0.5 text-[var(--muted)]">
              {cnpjData.porte}
            </span>
            <span className="rounded bg-[var(--surface-hover)] px-2 py-0.5 text-[var(--muted)]">
              {cnpjData.natureza_juridica}
            </span>
          </div>
        </div>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text)]">
            Oportunidades Relacionadas
          </h3>
        </div>

        {isSearching ? (
          <div className="py-12 text-center text-sm text-[var(--muted)]">Consultando APIs...</div>
        ) : procurements.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {procurements.slice(0, 6).map((p) => (
              <ProcurementCard key={p.id} procurement={p} showShare />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Informe um CNPJ para buscar oportunidades compatíveis.
          </p>
        )}
      </section>
    </div>
  )
}
