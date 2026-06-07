import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl, formatPercent } from '../utils/format'
import type { Procurement } from '../types'

export function BiAvancado() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchPncp({ q: 'serviço', tam_pagina: 50 }).then((items) => {
      setData(items)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Calculando indicadores da PNCP...</p>
      </div>
    )
  }

  const totalValue = data.reduce((s, p) => s + p.valueBrl, 0)
  const homologadas = data.filter((p) => p.status === 'homologado')
  const abertas = data.filter((p) => p.status === 'aberto')
  const winRate = data.length > 0 ? homologadas.length / data.length : 0

  const ufCount = new Map<string, number>()
  data.forEach((p) => {
    ufCount.set(p.uf, (ufCount.get(p.uf) || 0) + 1)
  })
  const topUf = [...ufCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)

  const modalidadeCount = new Map<string, number>()
  data.forEach((p) => {
    if (p.modalidade) modalidadeCount.set(p.modalidade, (modalidadeCount.get(p.modalidade) || 0) + 1)
  })
  const topModalidade = [...modalidadeCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">BI Avançado & Analytics</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Indicadores reais calculados da PNCP.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-center">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Volume Total Estimado</p>
          <p className="mt-2 text-2xl font-bold text-[var(--brand)]">{formatBrl(totalValue)}</p>
          <span className="text-[10px] text-[var(--muted)]">{data.length} licitações no recorte</span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-center">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Tx. Homologação</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text)]">{formatPercent(winRate * 100)}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{homologadas.length} de {data.length} homologadas</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-center">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Abertas vs Andamento</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text)]">{abertas.length}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{data.length - abertas.length} em outras fases</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Top UFs</h3>
          <div className="space-y-2">
            {topUf.map(([uf, n]) => (
              <div key={uf} className="flex justify-between items-center">
                <span className="text-sm text-[var(--text)]">{uf}</span>
                <span className="text-sm font-mono text-[var(--muted)]">{n} licitações</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Top Modalidades</h3>
          <div className="space-y-2">
            {topModalidade.map(([m, n]) => (
              <div key={m} className="flex justify-between items-center">
                <span className="text-sm text-[var(--text)]">{m}</span>
                <span className="text-sm font-mono text-[var(--muted)]">{n} ocorrências</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
