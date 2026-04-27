export function CertidoesNegativas() {
  const CERTIDOES = [
    { nome: 'Certidão Negativa de Débitos Federais', orgao: 'Receita Federal', validade: '2026-06-15', status: 'válida' },
    { nome: 'Regularidade FGTS', orgao: 'Caixa Econômica', validade: '2026-04-10', status: 'vencendo' },
    { nome: 'Certidão Negativa Trabalhista', orgao: 'TST', validade: '2026-03-01', status: 'vencida' },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Certidões Negativas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Controle de CNDs e documentação exigida em habilitação.
        </p>
      </header>

      <div className="grid gap-4">
        {CERTIDOES.map((c) => (
          <div key={c.nome} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div>
              <p className="font-medium text-sm text-[var(--text)]">{c.nome}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{c.orgao} • Validade: {c.validade}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              c.status === 'válida' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              c.status === 'vencendo' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {c.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
