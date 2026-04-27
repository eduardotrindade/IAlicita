export function AssistenteJuridico() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Assistente Jurídico (Lei 14.133/21)</h2>
        <p className="text-sm text-[var(--muted)]">Jurisprudência, Acórdãos do TCU e Leis de Licitação.</p>
      </header>
      
      <div className="flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-6">
        <div className="flex flex-col items-start">
          <div className="max-w-[80%] rounded-lg bg-[var(--surface-hover)] p-3 text-sm text-[var(--text)]">
            Olá! Sou seu assistente de Licitações. Como posso ajudar com a Lei 14.133 ou jurisprudências hoje?
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="max-w-[80%] rounded-lg bg-[var(--brand)] text-white p-3 text-sm">
            Quais são os limites de dispensa de licitação atuais na nova lei para obras?
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="max-w-[80%] rounded-lg bg-[var(--surface-hover)] p-3 text-sm text-[var(--text)]">
            De acordo com o Art. 75, I da Lei 14.133/2021, para obras e serviços de engenharia ou de serviços de manutenção de veículos automotores, o limite para dispensa de licitação é de R$ 100.000,00 (cem mil reais), valor este que é atualizado anualmente por decreto do Poder Executivo.
          </div>
          <span className="text-xs text-[var(--muted)] mt-1 ml-2">Fonte: Art. 75, I, Lei 14.133/2021</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <input className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)]" placeholder="Digite sua dúvida sobre leis e acórdãos..." />
        <button className="rounded-md bg-[var(--brand)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]">Enviar</button>
      </div>
    </div>
  )
}
