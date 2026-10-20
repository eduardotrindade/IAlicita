'use client'

import { useState } from 'react'
import { ProcurementCard } from '@/components/ProcurementCard'
import { lookupCnpj } from '@/lib/cnpjApi'
import { searchPncp } from '@/lib/pncpApi'
import type { CnpjData, Procurement } from '@/types'

export default function Matchmaking() {
  const [cnpj, setCnpj] = useState('')
  const [company, setCompany] = useState<CnpjData | null>(null)
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [matches, setMatches] = useState<Procurement[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) return

    setLoadingCnpj(true)
    setLoadingMatches(true)
    setSearched(true)

    const companyData = await lookupCnpj(digits)
    setCompany(companyData)
    setLoadingCnpj(false)

    if (companyData) {
      const terms = [
        companyData.nome,
        companyData.fantasia,
        companyData.atividade_principal?.text,
        ...(companyData.atividades_secundarias || []).map((a) => a.text),
      ]
        .filter(Boolean)
        .slice(0, 3)
        .join(' ')

      const items = await searchPncp({ q: terms, tam_pagina: 15 })
      setMatches(items)
    }
    setLoadingMatches(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Matchmaking</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Encontre licitações compatíveis com seu perfil de empresa via CNPJ.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          CNPJ da empresa
          <input
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
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
          {loadingCnpj ? 'Consultando...' : 'Buscar Oportunidades'}
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
                {company.atividade_principal?.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {loadingMatches ? (
        <div className="animate-pulse py-8 text-center text-sm text-[var(--muted)]">
          Buscando licitações compatíveis...
        </div>
      ) : searched ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {matches.map((p) => (
            <ProcurementCard key={p.id} procurement={p} showShare />
          ))}
          {matches.length === 0 && (
            <p className="col-span-2 py-8 text-center text-sm text-[var(--muted)]">
              Nenhuma licitação compatível encontrada.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
