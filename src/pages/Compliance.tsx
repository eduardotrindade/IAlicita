export function Compliance() {
   return (
     <div className="space-y-6">
       <header>
         <h2 className="text-base font-semibold text-[var(--text)]">Políticas e Compliance (RAG Integrado)</h2>
         <p className="mt-1 text-sm text-[var(--muted)]">Governança, Políticas de Integridade e LGPD (adequação à nova Lei de Licitações).</p>
       </header>
       <div className="grid md:grid-cols-2 gap-6">
         <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
             <h3 className="font-medium text-sm text-[var(--text)] border-b border-[var(--border)] pb-2">Status do Programa de Integridade</h3>
             <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">Código de Conduta Ética</span>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">Vigente</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">Certificação LGPD</span>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">Auditoria Concluída</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">Selo Empresa Pró-Ética (CGU)</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded">Em Avaliação</span>
             </div>
         </div>
         <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-5 shadow-sm">
             <h3 className="font-medium text-sm text-[var(--text)] mb-3">Análise de Risco (Due Diligence RAG)</h3>
             <p className="text-xs text-[var(--muted)] leading-relaxed">
               Com base nos regulamentos federais, a IA rastreou sua documentação e não acusou nenhuma pendência impeditiva junto ao TCU ou CEIS (Cadastro de Empresas Inidôneas). O compliance da empresa está apto para certames com exigência de programa de integridade pleno.
             </p>
         </div>
       </div>
     </div>
   )
}
