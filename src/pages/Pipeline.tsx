import { MOCK_PROCUREMENTS } from '../data/mockData'

const COLUMNS = ['Monitorando', 'Análise', 'Proposta', 'Ganhou', 'Perdido']

export function Pipeline() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">
          Pipeline Visual de Licitações
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhe os certames pelo Kanban. Arraste e solte (mock).
        </p>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col, idx) => (
          <div
            key={col}
            className="flex w-72 flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text)]">{col}</h3>
              <span className="rounded bg-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--muted)]">
                {idx === 0 ? 3 : idx === 1 ? 2 : 1}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Fake Cards */}
              {MOCK_PROCUREMENTS.slice(idx * 2, idx * 2 + (idx === 0 ? 3 : idx === 1 ? 2 : 1)).map(
                (p) => (
                  <div
                    key={p.id}
                    className="cursor-move space-y-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm hover:border-[var(--brand)]"
                  >
                    <p className="line-clamp-2 text-xs font-medium leading-tight text-[var(--text)]">
                      {p.title}
                    </p>
                    <div className="flex justify-between text-xs text-[var(--muted)]">
                      <span>{p.portal}</span>
                      <span>{p.uf}</span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
