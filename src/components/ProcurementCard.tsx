import { memo } from 'react'
import type { Procurement } from '../types'
import { formatBrl, formatDatePt, formatPercent } from '../utils/format'
import { ShareButtons } from './ShareButtons'

type Props = {
  procurement: Procurement
  favorite?: boolean
  onToggleFavorite?: () => void
  showShare?: boolean
}

const statusLabel: Record<Procurement['status'], string> = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  homologado: 'Homologado',
  deserto: 'Deserto',
  cancelado: 'Cancelado',
}

export const ProcurementCard = memo(function ProcurementCard({
  procurement: p,
  favorite,
  onToggleFavorite,
  showShare = true,
}: Props) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {onToggleFavorite ? (
              <button
                type="button"
                onClick={onToggleFavorite}
                className="text-lg leading-none text-amber-400 hover:opacity-90"
                title={favorite ? 'Remover das escolhidas' : 'Marcar como escolhida'}
                aria-pressed={favorite}
              >
                {favorite ? '★' : '☆'}
              </button>
            ) : null}
            <h3 className="text-sm font-semibold text-[var(--text)]">{p.title}</h3>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {p.portal} · {p.uf}
            {p.technicalScore != null ? (
              <span className="ml-2 rounded bg-[var(--accent-muted)] px-1.5 py-0.5 font-mono text-[var(--accent)]">
                {formatPercent(p.technicalScore)} conf.
              </span>
            ) : null}
          </p>
        </div>
        <span className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-medium uppercase text-[var(--muted)]">
          {statusLabel[p.status]}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {p.keywordsMatched.map((k) => (
          <span
            key={k}
            className="rounded-full bg-[var(--bg)] px-2 py-0.5 text-[10px] text-[var(--muted)]"
          >
            {k}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[var(--text)]">
        <span>{formatBrl(p.valueBrl)}</span>
        <span className="text-[var(--muted)]">Prazo {formatDatePt(p.deadline)}</span>
      </div>
      {showShare ? (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Enviar oportunidade
          </p>
          <ShareButtons procurement={p} compact />
        </div>
      ) : null}
    </article>
  )
})
