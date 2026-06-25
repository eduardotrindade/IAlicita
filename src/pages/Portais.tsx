export function Portais() {
  const PORTAIS_OFICIAIS = [
    { nome: 'PNCP', desc: 'Portal Nacional de Contratações Públicas', url: 'https://pncp.gov.br' },
    { nome: 'Compras.gov.br', desc: 'Governo Federal - Dados Abertos', url: 'https://dadosabertos.compras.gov.br' },
    { nome: 'BEC-SP', desc: 'Bolsa Eletrônica de Compras de SP', url: 'https://www.bec.sp.gov.br' },
    { nome: 'Compras MG', desc: 'Portal de Compras de Minas Gerais', url: 'https://www.compras.mg.gov.br' },
    { nome: 'SEPLAG/MT', desc: 'Sistema SIAG - Mato Grosso', url: 'https://aquisicoes.seplag.mt.gov.br' },
    { nome: 'Portal de Compras PA', desc: 'Pará', url: 'https://www.portaldecompras.pa.gov.br' },
    { nome: 'Compras BA', desc: 'Bahia', url: 'https://www.compras.ba.gov.br' },
    { nome: 'CEIS/CNEP', desc: 'Cadastros de Empresas Inidôneas', url: 'https://portaldacontratacao.gov.br/ceis' },
  ]

  const PLATAFORMAS_BUSCA = [
    { nome: 'Effecti', desc: 'Integra mais de 1.400 portais para facilitar a busca.' },
    { nome: 'Siga Pregão', desc: 'Pesquisas diárias automáticas em diversos portais.' },
    { nome: 'Licit Mais Brasil', desc: 'Focado em empresários e fornecedores.' },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Diretório de Portais</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Fontes de licitações integradas e rastreadas pelas palavras-chave.
        </p>
      </header>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Portais Oficiais (Bases)</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {PORTAIS_OFICIAIS.map((p) => (
            <a
              key={p.nome}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm hover:border-[var(--brand)] transition-colors"
            >
              <p className="font-semibold text-sm text-[var(--text)]">{p.nome}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{p.desc}</p>
              <p className="text-[10px] text-[var(--brand)] mt-1 truncate">{p.url}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Plataformas de Monitoramento</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {PLATAFORMAS_BUSCA.map((p) => (
            <div key={p.nome} className="rounded-lg border border-[var(--brand)] bg-[var(--surface-hover)] p-4 shadow-sm">
              <p className="font-semibold text-sm text-[var(--text)]">{p.nome}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
