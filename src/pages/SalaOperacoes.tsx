export function SalaOperacoes() {
  const PREGOES_HOJE = [
    { id: 'Pregão 012/2026', orgao: 'Ministério Público', status: 'Em Disputa (Lances Aberto)', concorrentes: 4, meuLance: 'R$ 84.000', menorLance: 'R$ 81.500 (Empresa X)' },
    { id: 'Pregão 088/2026', orgao: 'TRT da 5ª Região', status: 'Aguardando Início', concorrentes: 3, meuLance: '-', menorLance: '-' },
  ]
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)] text-red-600 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Sala de Operações (Ao Vivo)
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Monitoramento de pregões ocorrendo hoje. Dossiê pré-pregão e acompanhamento de lances.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
           {PREGOES_HOJE.map(p => (
             <div key={p.id} className="rounded border border-[var(--brand)] bg-[var(--surface-hover)] p-4 shadow-sm relative">
               {p.status.includes('Disputa') && <div className="absolute top-0 left-0 w-full h-1 bg-[var(--brand)] animate-pulse rounded-t"></div>}
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--text)]">{p.id}</h3>
                    <p className="text-xs text-[var(--muted)]">{p.orgao}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-white bg-red-600 px-2 py-0.5 rounded">{p.status}</span>
               </div>
               <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                 <div className="bg-[var(--surface)] p-2 rounded">
                    <span className="text-[var(--muted)] block">Meu LanceAtual</span>
                    <strong className="text-[var(--text)]">{p.meuLance}</strong>
                 </div>
                 <div className="bg-[var(--surface)] p-2 rounded border border-red-200 dark:border-red-900/50">
                    <span className="text-[var(--muted)] block">Menor Lance Coletado</span>
                    <strong className="text-red-500">{p.menorLance}</strong>
                 </div>
               </div>
             </div>
           ))}
        </div>
        
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
           <h3 className="font-semibold text-sm text-[var(--text)] border-b border-[var(--border)] pb-2 mb-4">Dossiê de Concorrentes (Pré-Pregão)</h3>
           <p className="text-xs text-[var(--muted)] mb-3">Detectados na sala de disputa do Pregão 012/2026:</p>
           <ul className="space-y-3">
              <li className="flex justify-between items-center bg-[var(--surface-hover)] p-2 rounded">
                 <div> <strong className="text-xs text-[var(--text)] block">Empresa Alpha TI (SP)</strong> <span className="text-[10px] text-[var(--muted)]">Win Rate: 34% - Preço Agressivo</span> </div>
                 <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 px-2 py-1 rounded">Risco Alto</span>
              </li>
              <li className="flex justify-between items-center bg-[var(--surface-hover)] p-2 rounded">
                 <div> <strong className="text-xs text-[var(--text)] block">Beta Solutions (MG)</strong> <span className="text-[10px] text-[var(--muted)]">Win Rate: 12% - Desiste fácil</span> </div>
                 <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 px-2 py-1 rounded">Risco Baixo</span>
              </li>
           </ul>
        </div>
      </div>
    </div>
  )
}
