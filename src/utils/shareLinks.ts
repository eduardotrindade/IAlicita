import type { Procurement } from '../types'
import { formatBrl, formatDatePt } from './format'

function buildOpportunityMessage(p: Procurement, baseUrl?: string): string {
  const linkLine = baseUrl ? `\nLink: ${baseUrl}` : ''
  return [
    `📋 ${p.title}`,
    `Portal: ${p.portal}`,
    `UF: ${p.uf}`,
    `Valor estimado: ${formatBrl(p.valueBrl)}`,
    `Prazo: ${formatDatePt(p.deadline)}`,
    `Status: ${p.status.replace('_', ' ')}`,
    p.keywordsMatched.length
      ? `Palavras-chave: ${p.keywordsMatched.join(', ')}`
      : null,
    p.technicalScore != null ? `Score técnico: ${p.technicalScore}%` : null,
    linkLine || null,
    '',
    '— IAlicita Portal de Licitações',
  ]
    .filter(Boolean)
    .join('\n')
}

/** Abre WhatsApp com texto pré-preenchido (usuário escolhe o contato). */
export function openWhatsAppShare(p: Procurement, appBaseUrl?: string): void {
  const text = buildOpportunityMessage(p, appBaseUrl)
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Abre diálogo de compartilhamento do Telegram (url + texto). */
export function openTelegramShare(p: Procurement, appBaseUrl?: string): void {
  const text = buildOpportunityMessage(p, appBaseUrl)
  const urlParam = appBaseUrl ?? ''
  const u = `https://t.me/share/url?url=${encodeURIComponent(urlParam)}&text=${encodeURIComponent(text)}`
  window.open(u, '_blank', 'noopener,noreferrer')
}
