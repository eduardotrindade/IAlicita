import type { Procurement } from '../types'

const PROXY_URL = import.meta.env.VITE_PNCP_BASE_URL || '/api-pncp'
const DIRECT_URL = 'https://pncp.gov.br'

export interface PncpItem {
  id: string
  index: string
  doc_type: string
  title: string
  description: string
  item_url: string
  document_type: string
  createdAt: string
  numero: number | null
  ano: string
  numero_sequencial: string
  numero_sequencial_compra_ata: string | null
  numero_controle_pncp: string
  orgao_id: string
  orgao_cnpj: string
  orgao_nome: string
  orgao_subrogado_id: string | null
  orgao_subrogado_nome: string | null
  unidade_id: string
  unidade_codigo: string
  unidade_nome: string
  esfera_id: string
  esfera_nome: string
  poder_id: string
  poder_nome: string
  municipio_id: string
  municipio_nome: string
  uf: string
  modalidade_licitacao_id: string
  modalidade_licitacao_nome: string
  situacao_id: string
  situacao_nome: string
  data_publicacao_pncp: string
  data_atualizacao_pncp: string
  data_assinatura: string | null
  data_inicio_vigencia: string | null
  data_fim_vigencia: string | null
  cancelado: boolean
  valor_global: number | null
  tem_resultado: boolean
  tipo_id: string
  tipo_nome: string
  tipo_contrato_id: string | null
  tipo_contrato_nome: string | null
  fonte_orcamentaria: string
  fonte_orcamentaria_id: string
  fonte_orcamentaria_nome: string
  exigencia_conteudo_nacional: boolean
  permite_adesao: boolean | null
  possui_emenda_parlamentar: boolean | null
  tipo_margem_preferencia: string
  tipo_margem_preferencia_id: string
  tipo_margem_preferencia_nome: string
}

export interface SearchParams {
  q?: string
  tipos_documento?: string
  tam_pagina?: number
  pagina?: number
  uf?: string
  situacao?: string
  modalidade?: string
}

function mapPncpToProcurement(i: PncpItem) {
  const statusMap: Record<string, string> = {
    '1': 'aberto',
    '2': 'em_andamento',
    '3': 'cancelado',
    '4': 'homologado',
    '5': 'deserto',
  }
  const deadline = i.data_fim_vigencia || i.data_assinatura || i.data_publicacao_pncp
  const value = i.valor_global || 0
  const title = i.title || i.tipo_nome || 'Edital'
  const keywords = [i.modalidade_licitacao_nome, i.esfera_nome]
    .filter(Boolean)

  return {
    id: i.id || i.numero_controle_pncp,
    title,
    portal: `PNCP - ${i.esfera_nome || 'Nacional'}`,
    uf: i.uf || 'BR',
    city: i.municipio_nome,
    valueBrl: value,
    status: (statusMap[i.situacao_id] || 'aberto') as Procurement['status'],
    deadline: deadline ? deadline.split('T')[0] : new Date().toISOString().split('T')[0],
    keywordsMatched: keywords,
    technicalScore: undefined,
    orgao: i.orgao_nome,
    unidade: i.unidade_nome,
    modalidade: i.modalidade_licitacao_nome,
    situacao: i.situacao_nome,
    dataPublicacao: i.data_publicacao_pncp?.split('T')[0],
  }
}

const fetchFromUrl = async (baseUrl: string, params: SearchParams) => {
  const query = params.q || 'software'
  const tipoDoc = params.tipos_documento || 'edital'
  const tamanho = params.tam_pagina || 20
  const pagina = params.pagina || 1
  const ufParam = params.uf ? `&uf=${encodeURIComponent(params.uf)}` : ''

  const res = await fetch(
    `${baseUrl}/api/search/?q=${encodeURIComponent(query)}&tipos_documento=${tipoDoc}&tam_pagina=${tamanho}&pagina=${pagina}${ufParam}`,
    { method: 'GET', headers: { 'Accept': 'application/json' } }
  )
  if (!res.ok) throw new Error(`PNCP erro ${res.status}`)
  const data = await res.json()
  const items: PncpItem[] = data.items || data || []
  return items.map(mapPncpToProcurement)
}

export const searchPncp = async (params: SearchParams = {}): Promise<ReturnType<typeof mapPncpToProcurement>[]> => {
  try {
    return await fetchFromUrl(DIRECT_URL, params)
  } catch {
    try {
      return await fetchFromUrl(PROXY_URL, params)
    } catch (err) {
      console.error('Erro na API PNCP (direta e proxy)', err)
      return []
    }
  }
}

export const fetchPncpDetails = async (orgaoCnpj: string, ano: string, sequencial: string) => {
  const tryUrl = async (baseUrl: string) => {
    const res = await fetch(
      `${baseUrl}/api/compras/${orgaoCnpj}/${ano}/${sequencial}`,
      { method: 'GET', headers: { 'Accept': 'application/json' } }
    )
    if (!res.ok) throw new Error(`PNCP detalhe erro ${res.status}`)
    return await res.json()
  }
  try {
    return await tryUrl(PROXY_URL)
  } catch {
    try {
      return await tryUrl(DIRECT_URL)
    } catch (err) {
      console.error('Erro ao buscar detalhes PNCP', err)
      return null
    }
  }
}
