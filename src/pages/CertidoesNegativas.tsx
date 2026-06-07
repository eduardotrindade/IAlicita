import { useState } from 'react'
import { lookupCnpj } from '../services/cnpjApi'
import type { CnpjData } from '../types'

export function CertidoesNegativas() {
  const [cnpj, setCnpj] = useState('')
  const [result, setResult] = useState<CnpjData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) {
      setError('CNPJ deve ter 14 dígitos')
      return
    }
    setLoading(true)
    const data = await lookupCnpj(digits)
    if (!data) {
      setError('CNPJ não encontrado na ReceitaWS')
    } else {
      setResult(data)
    }
    setLoading(false)
  }

  const statusColor = (situacao: string) => {
    if (situacao === 'ATIVA') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    if (situacao === 'SUSPENSA' || situacao === 'INAPTA') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Certidões Negativas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consulte a situação fiscal de um CNPJ na ReceitaWS.
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex max-w-md gap-3">
        <input
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)]"
          placeholder="Digite o CNPJ..."
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}

      {result ? (
        <div className="grid gap-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-[var(--text)]">{result.nome}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">CNPJ {result.cnpj}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(result.situacao)}`}>
                {result.situacao}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <p className="text-xs font-medium text-[var(--muted)] uppercase">Natureza Jurídica</p>
              <p className="mt-1 text-sm text-[var(--text)]">{result.natureza_juridica || '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <p className="text-xs font-medium text-[var(--muted)] uppercase">Porte</p>
              <p className="mt-1 text-sm text-[var(--text)]">{result.porte || '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <p className="text-xs font-medium text-[var(--muted)] uppercase">Data de Abertura</p>
              <p className="mt-1 text-sm text-[var(--text)]">{result.abertura || '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <p className="text-xs font-medium text-[var(--muted)] uppercase">Endereço</p>
              <p className="mt-1 text-sm text-[var(--text)]">
                {result.endereco.logradouro}, {result.endereco.numero} - {result.endereco.bairro}, {result.endereco.municipio}/{result.endereco.uf}
              </p>
            </div>
          </div>
        </div>
      ) : !loading && !error ? (
        <p className="text-sm text-[var(--muted)]">
          Informe um CNPJ para consultar a situação cadastral.
        </p>
      ) : null}
    </div>
  )
}
