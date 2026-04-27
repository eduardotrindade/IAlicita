export function GrafoSocietario() {
  const ALERTAS = [
    { cnpj: '11.***.***', nome: 'Omega Distribuidora', tipo: 'Cartel Potencial', desc: 'IDs de Lances Idênticos a outra empresa na mesma sessão', risco: 'Crítico' },
    { cnpj: '22.***.***', nome: 'Holding Participações', tipo: 'Empresa de Fachada', desc: 'Cruzo de 67M CNPJs: Sócios e IP Incomuns com vendedora Alpha', risco: 'Alto' }
  ]
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Grafo Societário & Auditoria Anticartel</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Detecte anomalias cruzando os CNPJs concorrentes em busca de ligações societárias ocultas.</p>
      </header>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)] uppercase text-xs">
              <th className="pb-3 pr-4 font-semibold">Empresa / Fornecedor</th>
              <th className="pb-3 px-4 font-semibold">Tipo de Anomalia</th>
              <th className="pb-3 px-4 font-semibold">Descrição RAG</th>
              <th className="pb-3 pl-4 font-semibold text-right">Criticidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
             {ALERTAS.map(a => (
               <tr key={a.cnpj}>
                 {/* Mock UI */}
                 <td className="py-3 pr-4"><span className="font-medium text-[var(--text)] block">{a.nome}</span><span className="text-[10px] text-[var(--muted)]">{a.cnpj}</span></td>
                 <td className="py-3 px-4 text-orange-600 dark:text-orange-400 font-medium">{a.tipo}</td>
                 <td className="py-3 px-4 text-[var(--text)] text-xs max-w-sm">{a.desc}</td>
                 <td className="py-3 pl-4 text-right">
                    <span className="px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs font-bold">{a.risco}</span>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
