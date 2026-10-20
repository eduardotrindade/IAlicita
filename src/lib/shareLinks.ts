import type { Procurement } from '@/types'
import { formatBrl } from './format'

export function shareText(p: Procurement): string {
  return [
    `📋 ${p.title}`,
    `Portal: ${p.portal}`,
    `UF: ${p.uf}`,
    `Valor: ${formatBrl(p.valueBrl)}`,
    `Prazo: ${p.deadline}`,
    '',
    '— IAlicita',
  ].join('\n')
}
