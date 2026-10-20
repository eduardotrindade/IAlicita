'use client'

import { useState } from 'react'
import { lookupCnpj } from '@/lib/cnpjApi'
import type { CnpjData } from '@/types'

export default function CertidoesNegativas() {
  const [cnpj, setCnpj] = useState('')
  const [company, setCompany] = useState<CnpjData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) {
      setError('CNPJ deve ter 14 dígitos')
      return
    }

    setLoading(true)
    setError('')
    setCompany(null)

    const data = await lookupCnpj(digits)
    if (data) {
      setCompany(data)
    } else {
      setError('Empresa não encontrada ou erro na consulta.')
    }
    setLoading(false)
  }

  const isActive = company?.situacao?.toLowerCase() === 'ativa'

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Certidões Negativas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consulta de situação cadastral na Receita Federal via CNPJ.
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
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {company && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-semibold text-[var(--text)]">
                {isActive ? 'ATIVA' : company.situacao?.toUpperCase() || 'DESCONHECIDA'}
              </span>
            </div>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-[var(--muted)]">Razão Social</p>
                <p className="text-[var(--text)]">{company.nome}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Nome Fantasia</p>
                <p className="text-[var(--text)]">{company.fantasia || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">CNPJ</p>
                <p className="font-mono text-[var(--text)]">{company.cnpj}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Abertura</p>
                <p className="text-[var(--text)]">{company.abertura}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Porte</p>
                <p className="text-[var(--text)]">{company.porte}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Natureza Jurídica</p>
                <p className="text-[var(--text)]">{company.natureza_juridica}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Endereço</p>
                <p className="text-[var(--text)]">
                  {company.endereco.logradouro}, {company.endereco.numero}
                  {company.endereco.complemento && ` - ${company.endereco.complemento}`}
                  <br />
                  {company.endereco.bairro} - {company.endereco.municipio}/{company.endereco.uf} -
                  CEP {company.endereco.cep}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">Atividades Econômicas</h3>
            <p className="text-xs text-[var(--muted)]">Principal</p>
            <p className="text-sm text-[var(--text)]">{company.atividade_principal?.text || '—'}</p>
            {company.atividades_secundarias?.length > 0 && (
              <>
                <p className="mt-2 text-xs text-[var(--muted)]">Secundárias</p>
                <ul className="list-inside list-disc text-sm text-[var(--text)]">
                  {company.atividades_secundarias.map((a) => (
                    <li key={a.code}>{a.text}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
