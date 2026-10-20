'use client'

import { useState } from 'react'
import { lookupCnpj } from '@/lib/cnpjApi'
import type { CnpjData } from '@/types'

export default function GrafoSocietario() {
  const [cnpj, setCnpj] = useState('')
  const [company, setCompany] = useState<CnpjData | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) return

    setLoading(true)
    const data = await lookupCnpj(digits)
    setCompany(data)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">
          Grafo Societário (Anticartel)
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Análise de QSA (Quadro Societário) via ReceitaWS para detecção de vínculos entre empresas.
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
          disabled={loading || cnpj.replace(/\D/g, '').length !== 14}
          className="self-end rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Consultando...' : 'Analisar'}
        </button>
      </div>

      {company && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-muted)] text-lg font-bold text-[var(--accent)]">
                {company.nome.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{company.nome}</p>
                <p className="text-xs text-[var(--muted)]">
                  {company.fantasia && `${company.fantasia} · `}
                  {company.cnpj}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">
              Quadro Societário (QSA)
            </h3>
            {company.qsa && company.qsa.length > 0 ? (
              <div className="space-y-2">
                {company.qsa.map((socio) => (
                  <div
                    key={socio.nome}
                    className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-sm"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-muted)] text-xs font-bold text-[var(--accent)]">
                      {socio.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text)]">{socio.nome}</p>
                      <p className="text-xs text-[var(--muted)]">{socio.qual}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-[var(--muted)]">
                QSA não disponível para este CNPJ.
              </p>
            )}
          </div>

          {company.qsa && company.qsa.length >= 2 && (
            <div className="rounded-xl border border-amber-700/50 bg-amber-900/10 p-4">
              <p className="text-sm font-semibold text-amber-400">
                ⚠️ Possível vínculo societário detectado
              </p>
              <p className="mt-1 text-xs text-amber-300">
                Esta empresa possui {company.qsa.length} sócio(s). Recomenda-se verificar
                participação cruzada em licitações.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
