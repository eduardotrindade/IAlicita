'use client'

import { useState } from 'react'

export default function PncpIntegracaoPage() {
  const [env, setEnv] = useState<'treinamento' | 'producao'>('treinamento')
  const [cnpj, setCnpj] = useState('00.394.460/0001-41')
  const [usuario, setUsuario] = useState('integrador.ialicita')
  const [senha, setSenha] = useState('********')
  const [loading, setLoading] = useState(false)
  const [authResult, setAuthResult] = useState<{ success?: boolean; token?: string; message?: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'credenciamento' | 'publicacao' | 'dominios' | 'guia'>('credenciamento')

  // Publicação state
  const [pubObjeto, setPubObjeto] = useState('Aquisição de Solução de Inteligência Artificial para Automação de Licitações')
  const [pubValor, setPubValor] = useState('150000.00')
  const [pubModalidade, setPubModalidade] = useState('6') // Pregão Eletrônico
  const [pubResult, setPubResult] = useState<any>(null)
  const [pubLoading, setPubLoading] = useState(false)

  // Dominios state
  const [domainType, setDomainType] = useState('modalidades')
  const [domainData, setDomainData] = useState<any[]>([])
  const [domainLoading, setDomainLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAuthResult(null)

    try {
      const res = await fetch('/api/pncp/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          env,
          cnpj,
          usuario,
          senha,
        }),
      })
      const data = await res.json()
      setAuthResult(data)
    } catch (err) {
      setAuthResult({ success: false, message: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    setPubLoading(true)
    setPubResult(null)

    try {
      const res = await fetch('/api/pncp/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          env,
          cnpj,
          payload: {
            objeto: pubObjeto,
            valorTotalEstimado: Number(pubValor),
            codigoModalidadeContratacao: Number(pubModalidade),
          },
        }),
      })
      const data = await res.json()
      setPubResult(data)
    } catch (err) {
      setPubResult({ success: false, message: (err as Error).message })
    } finally {
      setPubLoading(false)
    }
  }

  async function loadDomains(type: string) {
    setDomainType(type)
    setDomainLoading(true)
    try {
      const res = await fetch('/api/pncp/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'domains',
          env,
          domainType: type,
        }),
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setDomainData(data.data)
      } else {
        setDomainData([])
      }
    } catch {
      setDomainData([])
    } finally {
      setDomainLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Integração Oficial com o PNCP
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Portal Nacional de Contratações Públicas — Lei nº 14.133/2021
            </p>
          </div>
          <a
            href="https://www.gov.br/pncp/pt-br/pncp/integre-se-ao-pncp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            Portal Oficial Gov.br ↗
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--border)] gap-2">
        {[
          { id: 'credenciamento', label: '1. Credenciamento & Auth (JWT)' },
          { id: 'publicacao', label: '2. Envio / Publicação de Contratações' },
          { id: 'dominios', label: '3. Tabelas de Domínio' },
          { id: 'guia', label: '4. Guia Oficial de Integração' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Credenciamento & Auth */}
      {activeTab === 'credenciamento' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text)]">Configuração de Credenciais & Ambiente</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Insira os dados cadastrados no PNCP para autenticação via JSON Web Token (JWT).
            </p>

            <form onSubmit={handleLogin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text)]">Ambiente de Conexão</label>
                <select
                  value={env}
                  onChange={(e) => setEnv(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
                >
                  <option value="treinamento">Treinamento / Homologação (treina.pncp.gov.br)</option>
                  <option value="producao">Produção (pncp.gov.br)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text)]">CNPJ da Plataforma / Órgão</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text)]">Usuário de Integração</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text)]">Senha / Token de Acesso</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Autenticando no PNCP...' : 'Testar Conexão e Obter Token JWT'}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text)]">Resultado da Conexão & Status</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Retorno do handshake com a API REST do PNCP (Bearer Token).
            </p>

            {authResult ? (
              <div
                className={`mt-4 rounded-lg p-4 text-sm ${
                  authResult.success
                    ? 'border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300'
                    : 'border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
                }`}
              >
                <p className="font-semibold">{authResult.success ? '✓ Conectado com Sucesso' : '✕ Falha na Conexão'}</p>
                <p className="mt-1 text-xs">{authResult.message}</p>
                {authResult.token && (
                  <div className="mt-3">
                    <p className="text-[10px] font-mono uppercase text-[var(--muted)]">Token JWT Bearer Ativo:</p>
                    <code className="mt-1 block max-h-24 overflow-y-auto rounded bg-black/10 p-2 font-mono text-[11px] text-[var(--text)] dark:bg-white/10">
                      {authResult.token}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-center text-sm text-[var(--muted)]">
                <p>Nenhuma autenticação realizada nesta sessão.</p>
                <p className="text-xs">Preencha as credenciais ao lado e clique em testar.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Publicação de Contratações */}
      {activeTab === 'publicacao' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text)]">Enviar Contratação / Edital para o PNCP</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Publicação oficial de aviso de contratação nos termos da Lei 14.133/2021.
            </p>

            <form onSubmit={handlePublish} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text)]">Objeto da Contratação</label>
                <textarea
                  value={pubObjeto}
                  onChange={(e) => setPubObjeto(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text)]">Valor Total Estimado (R$)</label>
                  <input
                    type="text"
                    value={pubValor}
                    onChange={(e) => setPubValor(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text)]">Modalidade</label>
                  <select
                    value={pubModalidade}
                    onChange={(e) => setPubModalidade(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
                  >
                    <option value="6">Pregão Eletrônico (Cod 6)</option>
                    <option value="8">Dispensa de Licitação (Cod 8)</option>
                    <option value="9">Inexigibilidade (Cod 9)</option>
                    <option value="5">Concorrência Eletrônica (Cod 5)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={pubLoading}
                className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {pubLoading ? 'Transmitindo para o PNCP...' : 'Publicar Contratação no PNCP'}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text)]">Comprovante de Publicação / Retorno PNCP</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Metadados gerados e Número de Controle PNCP emitido pela API.
            </p>

            {pubResult ? (
              <div className="mt-4 space-y-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-600 dark:text-green-400">✓ Publicado com Sucesso</span>
                  <span className="text-xs text-[var(--muted)]">{pubResult.timestamp}</span>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase text-[var(--muted)]">Número de Controle PNCP:</p>
                  <p className="font-mono text-base font-bold text-[var(--accent)]">{pubResult.numeroControlePNCP}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase text-[var(--muted)]">Mensagem do Servidor:</p>
                  <p className="text-xs text-[var(--text)]">{pubResult.message}</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-center text-sm text-[var(--muted)]">
                <p>Nenhuma contratação publicada nesta sessão.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Tabelas de Domínio */}
      {activeTab === 'dominios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text)]">Consulta de Tabelas de Domínio Oficiais</h2>
            <div className="flex gap-2">
              {['modalidades', 'modosdisputa', 'amparoslegais'].map((type) => (
                <button
                  key={type}
                  onClick={() => loadDomains(type)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    domainType === type
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Descrição Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {domainLoading ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-[var(--muted)]">
                      Carregando domínios do PNCP...
                    </td>
                  </tr>
                ) : domainData.length > 0 ? (
                  domainData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">{item.codigo}</td>
                      <td className="px-4 py-3 text-[var(--text)]">{item.descricao}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-[var(--muted)]">
                      Nenhum dado carregado. Clique em uma das categorias acima.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Guia Oficial */}
      {activeTab === 'guia' && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">Instruções Oficiais de Integração ao PNCP</h2>
          <p className="text-sm text-[var(--muted)]">
            Baseado no manual oficial disponível em{' '}
            <a
              href="https://www.gov.br/pncp/pt-br/pncp/integre-se-ao-pncp"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline"
            >
              gov.br/pncp/pt-br/pncp/integre-se-ao-pncp
            </a>
          </p>

          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <h3 className="font-semibold text-sm text-[var(--text)]">1. Cadastro Inicial e Credenciamento</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                As plataformas digitais responsáveis pelo envio de dados dos órgãos e entidades públicas devem estar previamente credenciadas no sistema, utilizando CNPJ e senha para autenticação de integração.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <h3 className="font-semibold text-sm text-[var(--text)]">2. Ambientes de Homologação e Produção</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                O ambiente de Treinamento/Homologação (<code className="text-xs">https://treina.pncp.gov.br</code>) deve ser utilizado para testes de envio de contratações, itens e atas antes da publicação oficial em Produção (<code className="text-xs">https://pncp.gov.br</code>).
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <h3 className="font-semibold text-sm text-[var(--text)]">3. Protocolo REST e Formato JSON</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                A comunicação utiliza requisições REST/HTTP 1.1 com payloads em formato JSON codificados em UTF-8. A autenticação exige requisição POST em <code className="text-xs">/v1/usuarios/login</code> retornando token JWT no cabeçalho <code className="text-xs">Authorization: Bearer &lt;token&gt;</code>.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <h3 className="font-semibold text-sm text-[var(--text)]">4. Conformidade com a Lei 14.133/2021</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Todos os dados enviados devem respeitar as tabelas de domínio oficiais (modalidades, modos de disputa, amparos legais e tipos de documentos) para garantir a integridade e validade jurídica das contratações públicas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
