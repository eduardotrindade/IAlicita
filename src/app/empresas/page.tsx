'use client'

import { useState } from 'react'
import { ProcurementCard } from '@/components/ProcurementCard'
import { lookupCnpj } from '@/lib/cnpjApi'
import { searchPncp } from '@/lib/pncpApi'
import type { CnpjData, Procurement } from '@/types'

export default function Empresas() {
  const [cnpj, setCnpj] = useState('')
  const [company, setCompany] = useState<CnpjData | null>(null)
  const [matches, setMatches] = useState<Procurement[]>([])
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [loadingMatches, setLoadingMatches] = useState(false)

  async function handleSearch() {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) return

    setLoadingCnpj(true)
    setLoadingMatches(true)

    const data = await lookupCnpj(digits)
    setCompany(data)
    setLoadingCnpj(false)

    if (data) {
      const terms = [
        data.atividade_principal?.text,
        ...(data.atividades_secundarias || []).slice(0, 2).map((a) => a.text),
      ]
        .filter(Boolean)
        .join(' ')
      const items = await searchPncp({ q: terms || data.nome, tam_pagina: 10 })
      setMatches(items)
    }
    setLoadingMatches(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Empresas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consulta de CNPJ na ReceitaWS e licitações compatíveis na PNCP.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          CNPJ
          <input
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="00.000.000/0000-00"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loadingCnpj || cnpj.replace(/\D/g, '').length !== 14}
          className="self-end rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loadingCnpj ? 'Consultando...' : 'Pesquisar'}
        </button>
      </div>

      {company && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-muted)] text-lg font-bold text-[var(--accent)]">
              {company.nome.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{company.nome}</p>
              <p className="text-xs text-[var(--muted)]">
                {company.fantasia && `${company.fantasia} · `}
                {company.situacao} · {company.porte}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p className="text-xs text-[var(--muted)]">
              Atividade:{' '}
              <span className="text-[var(--text)]">{company.atividade_principal?.text}</span>
            </p>
            <p className="text-xs text-[var(--muted)]">
              Endereço:{' '}
              <span className="text-[var(--text)]">
                {company.endereco.municipio}/{company.endereco.uf}
              </span>
            </p>
          </div>
        </div>
      )}

      {loadingMatches ? (
        <div className="animate-pulse py-8 text-center text-sm text-[var(--muted)]">
          Buscando licitações compatíveis...
        </div>
      ) : matches.length > 0 ? (
        <div>
          <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Licitações relacionadas</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {matches.map((p) => (
              <ProcurementCard key={p.id} procurement={p} showShare />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
