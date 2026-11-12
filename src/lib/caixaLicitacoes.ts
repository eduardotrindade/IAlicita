/**
 * Módulo de Integração Específica para Licitações da Caixa Econômica Federal (CEF)
 * Conecta-se às APIs públicas (PNCP / Compras.gov) filtrando pelo CNPJ da CEF (00.360.305/0001-04)
 * e enriquece os links utilizando o Portal SICVE da CEF:
 * https://licitacoes.caixa.gov.br/sicve-web/public/view/portal/portal.jsf
 */

import { searchPncp } from './pncpApi'
import type { Procurement } from '@/types'

export const CEF_CNPJ = '00.360.305/0001-04'
export const CEF_CNPJ_RAW = '00360305000104'
export const CEF_PORTAL_URL = 'https://licitacoes.caixa.gov.br/sicve-web/public/view/portal/portal.jsf'

export interface CaixaLicitacaoItem extends Procurement {
  isCaixa: boolean
  certameNumero?: string
  certameAno?: string
}

/**
 * Busca licitações da Caixa Econômica Federal na API pública do PNCP,
 * filtrando pelo CNPJ da unidade administrativa da CEF (codigoUnidadeAdministrativa).
 * Enriquece os itens com link direto para o Portal SICVE da CEF.
 */
export async function searchCaixaLicitacoes(query = 'caixa'): Promise<CaixaLicitacaoItem[]> {
  const q = (query || '').trim()
  const buscaTermo = q && !/^(caixa|cef)$/i.test(q)

  try {
    // 1. Consulta direta à API pública do PNCP: contratações da CEF abertas para propostas
    const now = new Date()
    const fmt = (d: Date) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`

    const params = new URLSearchParams({
      dataFinal: fmt(now),
      cnpj: CEF_CNPJ_RAW,
      pagina: '1',
      tamanhoPagina: '50',
    })

    const res = await fetch(`https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(9000),
    })

    let items: CaixaLicitacaoItem[] = []

    if (res.ok) {
      const data = await res.json()
      const raw = Array.isArray(data?.data) ? data.data : []
      items = raw.map((l: Record<string, any>) => {
        const numeroControle = String(l.numeroControlePNCP || '')
        const matchNum = numeroControle.match(/-(\d+)-\d{4}\/(\d{4})$/)
        const certameNumero = matchNum ? matchNum[1] : ''
        const certameAno = matchNum ? matchNum[2] : ''
        const deadline = l.dataEncerramentoProposta || l.dataAberturaProposta || ''
        const situacaoNome = (l.situacaoCompraNome || '').toLowerCase()

        return {
          id: numeroControle || `${certameNumero}/${certameAno}`,
          title: l.objetoCompra || 'Contratação CAIXA',
          description: l.informacaoComplementar || l.objetoCompra || '',
          portal: 'Licitações CAIXA (SICVE)',
          uf: l.unidadeOrgao?.ufSigla || 'BR',
          city: l.unidadeOrgao?.municipioNome || '',
          valueBrl: Number(l.valorTotalEstimado || l.valorTotalHomologado || 0),
          status: situacaoNome.includes('encerr') || situacaoNome.includes('homolog')
            ? 'homologado'
            : 'aberto',
          deadline: deadline ? String(deadline).split('T')[0] : '',
          keywordsMatched: [l.modalidadeNome || ''].filter(Boolean),
          technicalScore: 70,
          orgao: l.orgaoEntidade?.razaoSocial || 'CAIXA ECONÔMICA FEDERAL',
          unidade: l.unidadeOrgao?.nomeUnidade,
          modalidade: l.modalidadeNome,
          situacao: l.situacaoCompraNome,
          dataPublicacao: String(l.dataPublicacaoPncp || '').split('T')[0],
          link: `${CEF_PORTAL_URL}${certameNumero ? `?certame=${certameNumero}&ano=${certameAno}` : ''}`,
          numeroControlePNCP: numeroControle,
          linkProcessoEletronico: l.linkProcessoEletronico || l.linkSistemaOrigem,
          isCaixa: true,
          certameNumero,
          certameAno,
        } as CaixaLicitacaoItem
      })
    }

    // 2. Fallback: busca textual via searchPncp (só mantém itens realmente da CEF)
    if (items.length === 0) {
      const viaTextual = await searchPncp({ q: buscaTermo ? q : 'caixa economica federal' })
      items = viaTextual
        .filter((item) => {
          const texto = `${item.orgao || ''} ${item.description || ''}`.toUpperCase()
          return texto.includes('CAIXA ECONÔMICA FEDERAL') ||
            texto.includes('CAIXA ECONOMICA FEDERAL') ||
            (item.orgao || '').includes('00.360.305')
        })
        .map((item) => ({
          ...item,
          portal: 'Licitações CAIXA (SICVE)',
          link: CEF_PORTAL_URL,
          isCaixa: true,
        }))
    }

    // 3. Filtro por termo do usuário (quando informado algo além de "caixa")
    if (buscaTermo) {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
      const filtrados = items.filter((i) => {
        const texto = `${i.title} ${i.description} ${i.orgao || ''}`.toLowerCase()
        return terms.some((t) => texto.includes(t))
      })
      if (filtrados.length > 0) items = filtrados
    }

    return items
  } catch (err) {
    console.warn('Erro ao buscar licitações da Caixa:', (err as Error)?.message)
    return []
  }
}
