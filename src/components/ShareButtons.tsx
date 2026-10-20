'use client'

import { formatBrl } from '@/lib/format'
import type { Procurement } from '@/types'

function shareText(p: Procurement): string {
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

type Props = {
  procurement: Procurement
  compact?: boolean
}

export function ShareButtons({ procurement, compact }: Props) {
  const text = shareText(procurement)
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  const tgUrl = `https://t.me/share/url?text=${encodeURIComponent(text)}`

  const baseClass =
    'rounded border border-[var(--border)] px-3 py-1 text-xs font-medium transition-colors'

  return (
    <div className={`flex gap-2 ${compact ? '' : ''}`}>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-green-700/20 text-green-400 hover:bg-green-700/30`}
      >
        WhatsApp
      </a>
      <a
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-blue-700/20 text-blue-400 hover:bg-blue-700/30`}
      >
        Telegram
      </a>
    </div>
  )
}
