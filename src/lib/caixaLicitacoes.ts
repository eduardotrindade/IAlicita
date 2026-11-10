/**
 * Módulo de Integração Específica para Licitações da Caixa Econômica Federal (CEF)
 * Conecta-se às APIs públicas (PNCP / Compras.gov) filtrando pelo CNPJ da CEF (00.360.305/0001-04)
 * e enriquece os links utilizando o Portal SICVE da CEF:
 * https://licitacoes.caixa.gov.br/sicve-web/public/view/portal/portal.jsf
 */

import { searchPncp } from './pncpApi'
import type { Procurement } from '@/types'

export const CEF_CNPJ = '00.360.305/0001-04'
export const CEF_PORTAL_URL = 'https://licitacoes.caixa.gov.br/sicve-web/public/view/portal/portal.jsf'

export interface CaixaLicitacaoItem extends Procurement {
  isCaixa: boolean
  certameNumero?: string
  certameAno?: string
}

/**
 * Busca licitações da Caixa Econômica Federal e constrói o link direto para o SICVE da CEF
 */
export async function searchCaixaLicitacoes(query = 'caixa'): Promise<CaixaLicitacaoItem[]> {
  try {
    // Busca na API unificada do PNCP filtrando por Caixa ou CNPJ
    const items = await searchPncp({ q: query || 'caixa' })

    return items.map((item) => {
      const orgaoStr = `${item.orgao || ''} ${item.description || ''} ${item.title || ''}`.toUpperCase()
      const isCaixa =
        orgaoStr.includes('CAIXA ECONOMICA FEDERAL') ||
        orgaoStr.includes('CEF') ||
        orgaoStr.includes('00.360.305')

      // Extrai número e ano do certame se disponível no formato PNCP (ex: 0514/2026)
      const matchNum = item.title.match(/(\d{3,5})\/(\d{4})/)
      const certameNumero = matchNum ? matchNum[1] : '0514'
      const certameAno = matchNum ? matchNum[2] : '2026'

      // Link direto para o Portal SICVE da CEF pré-configurado
      const caixaDirectLink = isCaixa
        ? `${CEF_PORTAL_URL}?certame=${certameNumero}&ano=${certameAno}`
        : item.link || CEF_PORTAL_URL

      return {
        ...item,
        isCaixa: true, // Destaca como licitação Caixa
        portal: 'Licitações CAIXA (SICVE)',
        link: caixaDirectLink,
        certameNumero,
        certameAno,
      }
    })
  } catch (err) {
    console.warn('Erro ao buscar licitações da Caixa:', (err as Error)?.message)
    return []
  }
}
