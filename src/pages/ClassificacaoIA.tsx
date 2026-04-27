import { MOCK_PROCUREMENTS } from '../data/mockData'

export function ClassificacaoIA() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Classificação com IA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Rotulação automática em categorias como Obras, TI, Saúde.</p>
      </header>
      <div className="grid gap-4">
        {MOCK_PROCUREMENTS.slice(0, 5).map(p => (
           <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm gap-4">
             <div className="flex-1">
               <p className="font-medium text-sm text-[var(--text)]">{p.title}</p>
               <p className="text-xs text-[var(--muted)] mt-1">{p.portal} • {p.uf}</p>
             </div>
             <div className="flex gap-2 shrink-0">
               <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 text-xs font-semibold">
                 {p.keywordsMatched.length > 0 ? "Tecnologia da Informação" : "Outros"}
               </span>
               <span className="rounded-full bg-[var(--surface-hover)] border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                 Confiança: 98%
               </span>
             </div>
           </div>
        ))}
      </div>
    </div>
  )
}
