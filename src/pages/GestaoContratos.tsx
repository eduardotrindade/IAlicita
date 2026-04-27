export function GestaoContratos() {
  const CONTRATOS = [
    { id: 'CT-2025/11', orgao: 'Ministério da Justiça', objeto: 'Serviços de SOC 24x7', vigencia: '2026-10-15', valor: 'R$ 1.200.000', empenhado: '50%', alertas: 'Aviso: Renovação em 6 meses' },
    { id: 'CT-2026/02', orgao: 'TRT 2ª Região', objeto: 'Sustentação de Datacenter', vigencia: '2026-05-10', valor: 'R$ 850.000', empenhado: '90%', alertas: 'Urgente: Aditivo Necessário' },
  ]
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Gestão de Contratos</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Administração do ciclo de vida, aditivos, reajustes e empenhos governamentais.</p>
      </header>
      <div className="grid gap-4">
        {CONTRATOS.map(c => (
          <div key={c.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm text-[var(--text)]">{c.id} - {c.orgao}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{c.objeto}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-md ${c.alertas.includes('Urgente') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                {c.alertas}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mt-4">
               <div><p className="text-xs text-[var(--muted)]">Valor Anual</p><p className="font-medium text-[var(--text)]">{c.valor}</p></div>
               <div><p className="text-xs text-[var(--muted)]">Vigência Fim</p><p className="font-medium text-[var(--text)]">{c.vigencia}</p></div>
               <div>
                  <p className="text-xs text-[var(--muted)]">Saldo Empenhado</p>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden">
                       <div className="h-full bg-[var(--brand)]" style={{width: c.empenhado}}></div>
                     </div>
                     <span className="text-xs font-medium">{c.empenhado}</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
