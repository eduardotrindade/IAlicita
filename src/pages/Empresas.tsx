import { MOCK_SUPPLIERS } from '../data/mockData'
import { formatBrl } from '../utils/format'

export function Empresas() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Analytics de Fornecedores</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Desempenho dos concorrentes do Portal da Transparência.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_SUPPLIERS.map((s) => (
          <article key={s.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[var(--text)]">{s.companyName}</h3>
                <p className="text-xs text-[var(--muted)]">{s.cnpjMask} • {s.uf}</p>
              </div>
              {s.isMicroOrSmall && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  ME/EPP
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--muted)]">Vitórias/Part.</p>
                <p className="font-mono text-sm font-semibold">{s.wins} / {s.participations}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Win Rate</p>
                <p className="font-mono text-sm font-semibold">{(s.winRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Valor Ganho</p>
                <p className="font-mono text-sm font-semibold">{formatBrl(s.totalWonValueBrl)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Ticket Médio</p>
                <p className="font-mono text-sm font-semibold">{formatBrl(s.avgTicketBrl)}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-[var(--muted)]">Portais Recentes</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {s.recentPortals.map((p) => (
                  <span key={p} className="rounded border border-[var(--border)] bg-[var(--surface-hover)] px-1.5 py-0.5 text-[10px] text-[var(--text)]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
