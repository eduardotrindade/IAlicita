export function MonitorPCA() {
  const ITENS_PCA = [
    {
      id: 1,
      orgao: 'Ministério da Justiça e Segurança Pública',
      objeto: 'Renovação do suporte SOC e NOC',
      valorEstimado: 'R$ 5.500.000',
      dataPrevista: '2026-06-15',
      status: 'Aguardando ETP',
    },
    {
      id: 2,
      orgao: 'Agência Nacional de Telecomunicações - ANATEL',
      objeto: 'Serviço de pentest contínuo',
      valorEstimado: 'R$ 890.000',
      dataPrevista: '2026-07-10',
      status: 'Em Fase Interna',
    },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Monitor PCA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhamento do Plano de Contratações Anual (Compras.gov.br e PNCP) das instituições rastreadas.
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm shadow-sm relative">
        <table className="w-full text-left">
          <thead className="bg-[var(--surface-hover)] text-xs uppercase text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Órgão</th>
              <th className="px-4 py-3 font-medium">Objeto</th>
              <th className="px-4 py-3 font-medium">Est. Valor</th>
              <th className="px-4 py-3 font-medium">Previsão</th>
              <th className="px-4 py-3 font-medium">Status do Planejamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {ITENS_PCA.map((i) => (
              <tr key={i.id} className="hover:bg-[var(--surface-hover)]">
                <td className="px-4 py-3 text-[var(--text)]">{i.orgao}</td>
                <td className="px-4 py-3 text-[var(--text)]">{i.objeto}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{i.valorEstimado}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{i.dataPrevista}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
