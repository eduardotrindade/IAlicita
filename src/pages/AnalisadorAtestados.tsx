export function AnalisadorAtestados() {
    return (
      <div className="space-y-6 max-w-5xl">
         <header>
          <h2 className="text-base font-semibold text-[var(--text)]">Analisador de Atestados de Capacidade Técnica</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">O edital pede 30%? Descubra se os seus atestados suprem a soma de requisitos.</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-hover)] p-8 text-center cursor-pointer">
            <p className="text-sm font-medium text-[var(--text)]">Subir Edital (.pdf)</p>
          </div>
          <div className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-hover)] p-8 text-center cursor-pointer">
            <p className="text-sm font-medium text-[var(--text)]">Subir Atestados da Empresa</p>
          </div>
        </div>
  
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-[var(--text)] mb-4">Status Qualificação</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text)] font-medium">Requisito Edital: 2.000 horas de serviço de SOC</span>
                <span className="text-green-600 font-semibold">100% (2.500 horas provadas)</span>
              </div>
              <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text)] font-medium">Requisito Edital: Experiência Mínima de 2 anos em órgão público</span>
                <span className="text-red-500 font-semibold">Sem Comprovação Clara</span>
              </div>
              <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden">
                <div className="h-full bg-red-400 w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
