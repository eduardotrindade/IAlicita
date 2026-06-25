import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)]'
      : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]'
  }`

const group = 'mt-5 first:mt-0'
const groupTitle =
  'px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]'

type Item = { to: string; label: string; end?: boolean }

function NavGroup({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className={group}>
      <p className={groupTitle}>{title}</p>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={linkClass}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 min-w-[16rem] flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar)]">
      <div className="border-b border-[var(--border)] px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-muted)] text-sm font-bold text-[var(--accent)]">
            S
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-[var(--text)]">
              IAlicita
            </p>
            <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Portal de Licitações
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
        <NavGroup
          title="Visão geral"
          items={[
            { to: '/', label: 'Dashboard', end: true },
            { to: '/pipeline', label: 'Pipeline' },
            { to: '/alertas', label: 'Alertas' },
            { to: '/buscas', label: 'Buscas' },
          ]}
        />
        <NavGroup
          title="Inteligência & oportunidades"
          items={[
            { to: '/classificacao-ia', label: 'Classificação da IA' },
            { to: '/matchmaking', label: 'Matchmaking' },
            { to: '/mapas-uf', label: 'Mapas UF' },
            { to: '/mapa-competitividade', label: 'Mapa Competitividade' },
            { to: '/monitor-pca', label: 'Monitor PCA' },
          ]}
        />
        <NavGroup
          title="Ferramentas"
          items={[
            { to: '/assistente-juridico', label: 'Assistente Jurídico IA' },
            { to: '/pesquisa-precos', label: 'Pesquisa de Preços' },
            {
              to: '/analisador-especificacoes',
              label: 'Analisador de Especificações Técnicas',
            },
            { to: '/analisador-atestados', label: 'Analisador de Atestados' },
            { to: '/certidoes-negativas', label: 'Certidões Negativas' },
          ]}
        />
        <NavGroup
          title="Documentos"
          items={[
            { to: '/dod', label: 'DOD' },
            { to: '/etp', label: 'ETP' },
            { to: '/tr', label: 'TR' },
          ]}
        />
        <NavGroup
          title="Cadastros & referência"
          items={[
            { to: '/empresas', label: 'Empresas' },
            { to: '/portais', label: 'Portais' },
            { to: '/compliance', label: 'Compliance & LGPD' },
          ]}
        />
        <NavGroup
          title="Operações & Gestão"
          items={[
            { to: '/sala-operacoes', label: 'Sala de Operações (Lances)' },
            { to: '/robo-lances', label: 'Agente / Robô de Lances' },
            { to: '/propostas', label: 'Propostas e BDI' },
            { to: '/gestao-contratos', label: 'Gestão de Contratos' },
            { to: '/bi-avancado', label: 'BI Avançado' },
          ]}
        />
        <NavGroup
           title="Auditoria & Compliance"
           items={[
             { to: '/grafo-societario', label: 'Grafo Societário (Anticartel)' },
           ]}
        />
      </nav>
      <footer className="border-t border-[var(--border)] px-4 py-3 text-[10px] text-[var(--muted)]">
        Dados de exemplo — substitua por APIs reais (PNCP, portais estaduais).
      </footer>
    </aside>
  )
}
