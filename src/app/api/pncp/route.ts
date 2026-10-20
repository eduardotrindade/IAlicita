import { type NextRequest, NextResponse } from 'next/server'
import { filterFallbackItems } from '@/lib/pncpMockData'

export const dynamic = 'force-dynamic'

function formatDateToPncp(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

function mapModalidadeToCodigo(modalidade: string): number {
  const lower = modalidade.toLowerCase()
  if (lower.includes('preg') || lower.includes('pregao')) return 6 // Pregão Eletrônico
  if (lower.includes('dispensa')) return 8 // Dispensa de Licitação
  if (lower.includes('concorren')) return 14 // Concorrência Eletrônica
  if (lower.includes('inexig')) return 9 // Inexigibilidade
  if (lower.includes('concurso')) return 5
  if (lower.includes('leil')) return 7
  return 6 // Default: Pregão Eletrônico
}

async function fetchPncpWithTimeout(url: string, timeoutMs = 9000): Promise<Response | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
    })
    clearTimeout(timer)
    return res
  } catch {
    clearTimeout(timer)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const uf = (searchParams.get('uf') || '').toUpperCase()
  const modalidadeParam = searchParams.get('modalidade') || ''
  const situacao = searchParams.get('situacao') || ''
  const pagina = searchParams.get('pagina') || '1'
  const rawTam = Number.parseInt(searchParams.get('tam_pagina') || '20', 10)
  // PNCP API requires tamanhoPagina >= 10 and <= 50
  const tamanhoPagina = Math.min(Math.max(Number.isFinite(rawTam) ? rawTam : 20, 10), 50)

  // Intervalo de datas: últimos 45 dias
  const now = new Date()
  const past = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)
  const dataFinal = formatDateToPncp(now)
  const dataInicial = formatDateToPncp(past)

  const codigoModalidade = mapModalidadeToCodigo(modalidadeParam)

  try {
    // Tenta primeiro endpoint de publicações recentes
    const pncpUrl = `https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=${dataInicial}&dataFinal=${dataFinal}&codigoModalidadeContratacao=${codigoModalidade}&pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`
    const res = await fetchPncpWithTimeout(pncpUrl, 9000)

    if (res && res.ok) {
      const json = await res.json()
      const rawData = Array.isArray(json.data) ? json.data : []

      if (rawData.length > 0) {
        // Normaliza itens no formato esperado pelo frontend
        let items = rawData.map((item: Record<string, any>) => {
          const deadline =
            item.dataEncerramentoProposta ||
            item.dataAberturaProposta ||
            item.dataPublicacaoPncp ||
            new Date().toISOString()

          return {
            id: item.numeroControlePNCP || `${item.anoCompra}-${item.sequencialCompra}`,
            numero_controle_pncp: item.numeroControlePNCP,
            numeroControlePNCP: item.numeroControlePNCP,
            title: item.objetoCompra || item.modalidadeNome || 'Licitação Pública',
            description: item.objetoCompra || item.informacaoComplementar || '',
            portal: 'PNCP Oficial',
            uf: item.unidadeOrgao?.ufSigla || 'BR',
            city: item.unidadeOrgao?.municipioNome || '',
            valueBrl: Number(item.valorTotalEstimado || item.valorTotalHomologado || 0),
            valor_global: Number(item.valorTotalEstimado || 0),
            status: item.situacaoCompraNome?.toLowerCase().includes('abert') ||
              item.situacaoCompraNome?.toLowerCase().includes('divulg')
              ? 'aberto'
              : item.situacaoCompraNome?.toLowerCase().includes('homolog')
                ? 'homologado'
                : 'em_andamento',
            situacao_id: String(item.situacaoCompraId || '1'),
            situacao_nome: item.situacaoCompraNome || 'Divulgada',
            deadline: deadline.split('T')[0],
            data_fim_vigencia: item.dataEncerramentoProposta,
            data_publicacao_pncp: item.dataPublicacaoPncp,
            orgao: item.orgaoEntidade?.razaoSocial || item.orgaoEntidade?.cnpj,
            orgao_nome: item.orgaoEntidade?.razaoSocial,
            unidade: item.unidadeOrgao?.nomeUnidade,
            unidade_nome: item.unidadeOrgao?.nomeUnidade,
            municipio_nome: item.unidadeOrgao?.municipioNome,
            modalidade: item.modalidadeNome,
            modalidade_licitacao_nome: item.modalidadeNome,
            link: item.linkSistemaOrigem || item.linkProcessoEletronico,
            linkSistemaOrigem: item.linkSistemaOrigem,
            linkProcessoEletronico: item.linkProcessoEletronico,
            modoDisputa: item.modoDisputaNome,
            amparoLegal: item.amparoLegal?.nome,
            esfera_nome: item.orgaoEntidade?.esferaId === 'F' ? 'Federal' : item.orgaoEntidade?.esferaId === 'E' ? 'Estadual' : 'Municipal',
          }
        })

        // Filtro em memória caso o usuário tenha passado UF específica
        if (uf) {
          items = items.filter((i: any) => i.uf === uf)
        }

        // Filtro em memória por palavra-chave se solicitada
        if (q && q.trim()) {
          const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
          const matched = items.filter((i: any) => {
            const text = `${i.title} ${i.description} ${i.orgao || ''} ${i.unidade || ''}`.toLowerCase()
            return terms.some((t: string) => text.includes(t))
          })
          if (matched.length > 0) {
            items = matched
          }
        }

        return NextResponse.json({
          items,
          total: json.totalRegistros || items.length,
          totalPaginas: json.totalPaginas || 1,
          isFallback: false,
          source: 'pncp-live-api',
        })
      }
    }
  } catch (err) {
    console.warn('PNCP Live API error, using curated fallback:', (err as Error)?.message)
  }

  // Fallback seguro caso PNCP esteja fora do ar temporariamente
  const fallback = filterFallbackItems({ q, uf, modalidade: modalidadeParam, situacao })
  return NextResponse.json({
    items: fallback,
    total: fallback.length,
    isFallback: true,
    source: 'local-fallback',
  })
}
