export function Propostas() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Geração de Propostas e BDI (IA)</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Crie propostas baseando-se nas Margens e Tributos calculadas matematicamente para licitações.</p>
      </header>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text)]">Custo Direto do Projeto (R$)</label>
            <input type="text" className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm text-[var(--text)]" defaultValue="150.000,00" />
          </div>
           <div>
            <label className="block text-xs font-medium text-[var(--text)]">Tributos Adotados (ISS, PIS, COFINS)</label>
            <input type="text" className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm text-[var(--text)]" defaultValue="14,25%" />
          </div>
        </div>
        <div className="p-4 bg-[var(--surface-hover)] rounded-lg">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Sugestão de BDI Analisada pela IA</h3>
          <p className="text-xs text-[var(--muted)] mb-4">Com base na complexidade e jurisprudências do TCU (Acórdão 2622/2013-Plenário), sugerimos BDI de Contratação de TI Institucional.</p>
          <div className="flex justify-between items-center bg-[var(--surface)] border border-[var(--brand)] text-[var(--text)] rounded px-4 py-3">
             <span className="font-semibold">BDI Seguro Sugerido</span>
             <span className="text-lg font-bold text-[var(--brand)]">22,50%</span>
          </div>
        </div>
        <button className="w-full rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">Gerar Planilha de Preços Oficial</button>
      </div>
    </div>
  )
}
