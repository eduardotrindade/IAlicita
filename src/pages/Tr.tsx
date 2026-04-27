export function Tr() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">TR — Termo de Referência</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Termo de Referência e Mapa de Riscos associado.</p>
      </header>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text)]">1. Objeto</label>
          <input className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" placeholder="Especificação detalhada..." />
        </div>
         <div>
          <label className="block text-sm font-medium text-[var(--text)]">2. Justificativa e Objetivo</label>
          <textarea className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" rows={3}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text)]">3. Mapa de Riscos (Resumo)</label>
          <textarea className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm border-orange-300 focus:border-orange-500 text-[var(--text)] focus:ring-orange-500" rows={2} readOnly value="15 Riscos Identificados (Gerado Automaticamente - Ver Anexo)"></textarea>
        </div>
        <button className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]">Gerar TR Completo</button>
      </div>
    </div>
  )
}
