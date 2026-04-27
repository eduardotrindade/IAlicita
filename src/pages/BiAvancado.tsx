export function BiAvancado() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">BI Avançado & Analytics</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Relatórios consolidados de performance competitiva, Market Share e Receita Governamental.</p>
      </header>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-center">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Volume Ganho (YTD)</p>
          <p className="mt-2 text-2xl font-bold text-[var(--brand)]">R$ 14.8M</p>
          <span className="text-[10px] text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 rounded-full">+12% vs ano passado</span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-center">
           <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Win Rate Global</p>
           <p className="mt-2 text-2xl font-bold text-[var(--text)]">31.4%</p>
           <p className="text-xs text-[var(--muted)] mt-1">A Cada 3 editais, ganhamos 1</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-center">
           <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Principais Motivos Derrota</p>
           <div className="mt-2 flex flex-col gap-1 text-xs text-left">
             <div className="flex justify-between border-b border-[var(--border)] pb-1"><span>Preço Inexequível do Oponente</span><span className="font-semibold text-red-500">45%</span></div>
             <div className="flex justify-between border-b border-[var(--border)] pb-1"><span>Falta de Atestado Técnico</span><span className="font-semibold text-red-500">30%</span></div>
             <div className="flex justify-between"><span>Inabilitação Jurídica</span><span className="font-semibold text-red-500">25%</span></div>
           </div>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm h-64 flex items-center justify-center">
         <p className="text-sm text-[var(--muted)]">[Espaço para Gráfico de Barras / Linha de Evolução Mensal]</p>
      </div>
    </div>
  )
}
