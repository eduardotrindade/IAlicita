'use client'

import { memo } from 'react'
import { formatBrl, formatDatePt, formatPercent } from '@/lib/format'
import type { Procurement } from '@/types'
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
          {p.description && p.description !== p.title ? (
            <p className="mt-1 line-clamp-2 text-xs text-[var(--text)] opacity-85">
              {p.description}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-[var(--muted)]">
            {p.portal} · {p.uf}
            {p.orgao ? ` · ${p.orgao}` : ''}
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
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[var(--text)]">
          <span className="font-semibold text-emerald-400">{formatBrl(p.valueBrl)}</span>
          <span className="text-[var(--muted)]">Prazo: {formatDatePt(p.deadline)}</span>
        </div>
        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand)] px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90"
            title="Acessar edital oficial no portal de origem"
          >
            <span>Edital Oficial</span>
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : null}
      </div>
      {showShare ? (
        <div className="mt-3 border-t border-[var(--border)] pt-2.5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Enviar oportunidade
          </p>
          <ShareButtons procurement={p} compact />
        </div>
      ) : null}
    </article>
  )
})
