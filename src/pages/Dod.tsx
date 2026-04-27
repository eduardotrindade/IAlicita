export function Dod() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">DOD — Documento de Oficialização de Demanda</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Template de acordo com a IN SGD/ME nº 94/2022.</p>
      </header>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text)]">1. Necessidade da Contratação</label>
          <textarea className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" rows={3} placeholder="Descreva o problema a ser resolvido..."></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text)]">2. Resultados Esperados</label>
          <textarea className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" rows={3} placeholder="Benefícios diretos e indiretos..."></textarea>
        </div>
        <button className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]">Gerar DOD (PDF)</button>
      </div>
    </div>
  )
}
