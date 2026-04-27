export function AnalisadorEspecificacoes() {
  return (
    <div className="space-y-6 max-w-5xl">
       <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Analisador de Especificações Técnicas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Faça upload do Edital de um lado, e do seu Datasheet do outro.</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-hover)] hover:bg-[var(--surface)] p-8 text-center transition-colors">
          <p className="text-sm font-medium text-[var(--text)]">Arraste o Edital (.pdf)</p>
          <p className="text-xs text-[var(--muted)] mt-1">Extraia as exigências técnicas</p>
        </div>
        <div className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-hover)] hover:bg-[var(--surface)] p-8 text-center transition-colors">
          <p className="text-sm font-medium text-[var(--text)]">Arraste seus Manuais/Datasheets</p>
          <p className="text-xs text-[var(--muted)] mt-1">Para verificar a aderência</p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm mt-8">
        <h3 className="font-semibold text-sm text-[var(--text)] mb-4">Resultado da Análise</h3>
        <div className="flex items-center gap-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-r-md">
          <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold dark:bg-amber-800">
            85%
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Alerta de Conformidade Parcial</p>
            <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">Seu produto atende à maioria dos critérios, mas o edital exige fonte redundante hot-swap, característica ausente no seu datasheet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
