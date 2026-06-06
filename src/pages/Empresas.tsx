import { useState, useCallback } from 'react'
import { lookupCnpj } from '../services/cnpjApi'
import { searchPncp } from '../services/pncpApi'
import { formatBrl } from '../utils/format'
import type { CnpjData, Procurement } from '../types'

function empresaToCard(cnpjData: CnpjData, procurements: Procurement[]) {
  const wins = procurements.filter((p) => p.status === 'homologado').length
  const totalValue = procurements.reduce((s, p) => s + p.valueBrl, 0)
  const ufs = [...new Set(procurements.map((p) => p.uf).filter(Boolean))]

  return {
    id: cnpjData.cnpj,
    companyName: cnpjData.nome,
    fantasia: cnpjData.fantasia,
    cnpj: cnpjData.cnpj,
    uf: cnpjData.endereco.uf,
    isMicroOrSmall: cnpjData.porte === 'ME' || cnpjData.porte === 'EPP' || cnpjData.porte === 'MICROEMPRESA',
    wins,
    participations: procurements.length,
    totalWonValueBrl: totalValue,
    avgTicketBrl: procurements.length > 0 ? totalValue / procurements.length : 0,
    winRate: procurements.length > 0 ? wins / procurements.length : 0,
    atuacao: cnpjData.atividade_principal?.text || '',
    ufsAtuacao: ufs,
    situacao: cnpjData.situacao,
  }
}

export function Empresas() {
  const [cnpj, setCnpj] = useState('')
  const [cards, setCards] = useState<ReturnType<typeof empresaToCard>[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) {
      setError('CNPJ deve ter 14 dígitos')
      return
    }
    setLoading(true)
    const cnpjResult = await lookupCnpj(digits)
    if (!cnpjResult) {
      setError('CNPJ não encontrado')
      setLoading(false)
      return
    }
    const atividade = cnpjResult.atividade_principal?.text?.split(/\s+/).slice(0, 3).join(' ') || 'tecnologia'
    const procResult = await searchPncp({ q: atividade, tam_pagina: 15 })
    setCards((prev) => [...prev, empresaToCard(cnpjResult, procResult)])
    setLoading(false)
    setCnpj('')
  }, [cnpj])

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Analytics de Fornecedores</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consulte CNPJs na ReceitaWS e veja oportunidades relacionadas na PNCP.
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex max-w-md gap-3">
        <input
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          placeholder="Digite o CNPJ..."
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Adicionar'}
        </button>
      </form>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((s) => (
          <article key={s.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[var(--text)]">{s.companyName}</h3>
                <p className="text-xs text-[var(--muted)]">
                  {s.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.***.***/$4-$5')} • {s.uf}
                </p>
                {s.atuacao ? (
                  <p className="mt-1 text-[10px] text-[var(--muted)]">{s.atuacao}</p>
                ) : null}
              </div>
              {s.isMicroOrSmall && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  ME/EPP
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--muted)]">Oportunidades</p>
                <p className="font-mono text-sm font-semibold">{s.participations}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Win Rate</p>
                <p className="font-mono text-sm font-semibold">{(s.winRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Valor Estimado</p>
                <p className="font-mono text-sm font-semibold">{formatBrl(s.totalWonValueBrl)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Ticket Médio</p>
                <p className="font-mono text-sm font-semibold">{formatBrl(s.avgTicketBrl)}</p>
              </div>
            </div>

            {s.ufsAtuacao.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs text-[var(--muted)]">UFs de atuação</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {s.ufsAtuacao.map((u) => (
                    <span key={u} className="rounded border border-[var(--border)] bg-[var(--surface-hover)] px-1.5 py-0.5 text-[10px] text-[var(--text)]">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {cards.length === 0 && !loading ? (
        <p className="text-sm text-[var(--muted)]">
          Nenhum fornecedor consultado ainda. Informe um CNPJ acima para começar.
        </p>
      ) : null}
    </div>
  )
}
