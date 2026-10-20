import type { Procurement } from '@/types'
import { filterFallbackItems, type RawPncpItem } from './pncpMockData'
import { withRetry } from './retry'

type PncpItem = RawPncpItem

interface SearchParams {
  q?: string
  tipos_documento?: string
  tam_pagina?: number
  pagina?: number
  uf?: string
  situacao?: string
  modalidade?: string
}

function mapPncpToProcurement(i: PncpItem): Procurement {
  const statusMap: Record<string, Procurement['status']> = {
    '1': 'aberto',
    '2': 'em_andamento',
    '3': 'cancelado',
    '4': 'homologado',
    '5': 'deserto',
  }
  const deadline = i.data_fim_vigencia || i.data_assinatura || i.data_publicacao_pncp
  const value = i.valor_global || 0
  const title = i.title || i.tipo_nome || 'Edital'
  const keywords = [i.modalidade_licitacao_nome, i.esfera_nome].filter(Boolean)

  return {
    id: i.id || i.numero_controle_pncp,
    title,
    description: i.description,
    portal: `PNCP - ${i.esfera_nome || 'Nacional'}`,
    uf: i.uf || 'BR',
    city: i.municipio_nome,
    valueBrl: value,
    status: ((i as any).status as Procurement['status']) || statusMap[i.situacao_id] || 'aberto',
    deadline: deadline ? deadline.split('T')[0] : new Date().toISOString().split('T')[0],
    keywordsMatched: keywords as string[],
    technicalScore: 70 + ((Math.abs(Number(i.index || 1)) * 3) % 25),
    orgao: i.orgao_nome || (i as any).orgao,
    unidade: i.unidade_nome || (i as any).unidade,
    modalidade: i.modalidade_licitacao_nome || (i as any).modalidade,
    situacao: i.situacao_nome || (i as any).situacao,
    dataPublicacao: i.data_publicacao_pncp?.split('T')[0] || (i as any).dataPublicacao,
    link: (i as any).link || (i as any).linkSistemaOrigem,
    numeroControlePNCP: (i as any).numeroControlePNCP || i.numero_controle_pncp,
    linkProcessoEletronico: (i as any).linkProcessoEletronico,
  }
}

export async function searchPncp(
  params: SearchParams = {},
  signal?: AbortSignal,
): Promise<Procurement[]> {
  const query = params.q || 'software'
  const searchParams = new URLSearchParams({ q: query })
  if (params.tipos_documento) searchParams.set('tipos_documento', params.tipos_documento)
  if (params.tam_pagina) searchParams.set('tam_pagina', String(params.tam_pagina))
  if (params.pagina) searchParams.set('pagina', String(params.pagina))
  if (params.uf) searchParams.set('uf', params.uf)
  if (params.situacao) searchParams.set('situacao', params.situacao)
  if (params.modalidade) searchParams.set('modalidade', params.modalidade)

  try {
    const res = await fetch(`/api/pncp?${searchParams}`, { signal })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data?.items)) {
        return data.items.map(mapPncpToProcurement)
      }
      if (Array.isArray(data)) {
        return data.map(mapPncpToProcurement)
      }
    }
  } catch (_err) {
    // If request fails or times out, fallback to local dataset seamlessly
  }

  const fallback = filterFallbackItems({
    q: params.q,
    uf: params.uf,
    modalidade: params.modalidade,
    situacao: params.situacao,
  })
  return fallback.map(mapPncpToProcurement)
}
