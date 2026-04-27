import { useState } from 'react'
import { MOCK_PROCUREMENTS } from '../data/mockData'
import { ProcurementCard } from '../components/ProcurementCard'

export function Matchmaking() {
  const [cnpj, setCnpj] = useState('12.345.678/0001-90')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 800)
  }

  // Pega as melhores baseadas no score técnico
  const topMatches = [...MOCK_PROCUREMENTS]
    .filter((p) => p.technicalScore && p.technicalScore >= 70)
    .sort((a, b) => (b.technicalScore || 0) - (a.technicalScore || 0))

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Matchmaking Inteligente</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Descubra oportunidades perfeitas analisando o histórico do seu CNPJ (CNAEs, Atividade, Atestados).
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
          className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
        >
          Analisar
        </button>
      </form>

      {isSearching ? (
        <div className="py-12 text-center text-sm text-[var(--muted)]">Processando IA...</div>
      ) : (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Melhores Matches para {cnpj}
            </h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {topMatches.slice(0, 4).map((p) => (
              <div key={p.id} className="relative">
                <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                  ⚡ {p.technicalScore}% Match
                </div>
                <ProcurementCard procurement={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
