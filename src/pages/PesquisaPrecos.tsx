export function PesquisaPrecos() {
  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Pesquisa de Preços</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Estimativas de mercado e análise de BDI.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-[var(--text)]">Novo Item de Pesquisa</h3>
          <input className="block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]" placeholder="Ex: Firewall Fortinet 60F..." />
          <button className="w-full rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">Buscar na Base</button>
        </div>
        
        <div className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-[var(--text)] mb-4">Média de Mercado (Mock: Painel de Preços gov.br)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--surface-hover)] p-3 rounded-lg text-center">
              <p className="text-xs text-[var(--muted)]">Menor Preço</p>
              <p className="font-semibold text-[var(--text)] mt-1">R$ 4.200</p>
            </div>
             <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-300">Preço Estimado</p>
              <p className="font-semibold text-blue-900 dark:text-blue-100 mt-1">R$ 5.150</p>
            </div>
             <div className="bg-[var(--surface-hover)] p-3 rounded-lg text-center">
              <p className="text-xs text-[var(--muted)]">Maior Preço</p>
              <p className="font-semibold text-[var(--text)] mt-1">R$ 6.300</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
