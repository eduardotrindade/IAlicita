import { useState } from 'react'
import { lookupCnpj } from '../services/cnpjApi'
import type { CnpjData } from '../types'

export function GrafoSocietario() {
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
      setError('CNPJ não encontrado')
    } else {
      setResult(data)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Grafo Societário & Auditoria Anticartel</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consulte o quadro societário (QSA) de um CNPJ via ReceitaWS.
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex max-w-md gap-3">
        <input
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)]"
          placeholder="Digite o CNPJ (apenas números)"
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
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--text)]">{result.nome}</h3>
            <p className="text-xs text-[var(--muted)]">
              {result.fantasia ? `${result.fantasia} • ` : ''}
              CNPJ {result.cnpj} • {result.endereco.uf} • {result.situacao}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              {result.atividade_principal?.text || ''}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
              <span className="rounded bg-[var(--surface-hover)] px-2 py-0.5 text-[var(--muted)]">{result.porte}</span>
              <span className="rounded bg-[var(--surface-hover)] px-2 py-0.5 text-[var(--muted)]">{result.natureza_juridica}</span>
              <span className="rounded bg-[var(--surface-hover)] px-2 py-0.5 text-[var(--muted)]">Abertura: {result.abertura}</span>
            </div>
          </div>

          {result.qsa.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Quadro Societário (QSA)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted)] uppercase text-xs">
                      <th className="pb-3 pr-4 font-semibold">Nome</th>
                      <th className="pb-3 font-semibold">Qualificação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {result.qsa.map((q, i) => (
                      <tr key={i}>
                        <td className="py-3 pr-4 text-[var(--text)]">{q.nome}</td>
                        <td className="py-3 text-[var(--muted)]">{q.qual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {result.atividades_secundarias.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Atividades Secundárias</h3>
              <div className="flex flex-wrap gap-2">
                {result.atividades_secundarias.map((a, i) => (
                  <span key={i} className="rounded bg-[var(--surface-hover)] px-2 py-1 text-xs text-[var(--muted)]">
                    {a.code} - {a.text}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : !loading && !error ? (
        <p className="text-sm text-[var(--muted)]">
          Informe um CNPJ para consultar o quadro societário.
        </p>
      ) : null}
    </div>
  )
}
