export function Etp() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">ETP — Estudo Técnico Preliminar</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Planejamento da Solução de TI.</p>
      </header>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-5">
         <div>
          <label className="block text-sm font-medium text-[var(--text)]">1. Descrição da Necessidade</label>
          <textarea className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" rows={2}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text)]">2. Requisitos da Contratação</label>
          <textarea className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" rows={3}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text)]">3. Levantamento de Mercado</label>
          <textarea className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" rows={3}></textarea>
        </div>
        <button className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]">Gerar ETP</button>
      </div>
    </div>
  )
}
