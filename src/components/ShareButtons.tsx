import type { Procurement } from '../types'
import { openTelegramShare, openWhatsAppShare } from '../utils/shareLinks'

const BTN =
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]'

type Props = {
  procurement: Procurement
  compact?: boolean
}

export function ShareButtons({ procurement, compact }: Props) {
  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''
  return (
    <div className={compact ? 'flex flex-wrap gap-1' : 'flex flex-wrap gap-2'}>
      <button
        type="button"
        className={`${BTN} border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)]`}
        onClick={() => openWhatsAppShare(procurement, appUrl)}
        title="Enviar resumo no WhatsApp"
      >
        <span aria-hidden>💬</span>
        WhatsApp
      </button>
      <button
        type="button"
        className={`${BTN} border-[var(--accent-dim)] bg-[var(--accent-muted)] text-[var(--accent)] hover:opacity-95`}
        onClick={() => openTelegramShare(procurement, appUrl)}
        title="Compartilhar no Telegram"
      >
        <span aria-hidden>✈</span>
        Telegram
      </button>
    </div>
  )
}
