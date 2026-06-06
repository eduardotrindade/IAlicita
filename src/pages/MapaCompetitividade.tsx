import { useMemo, useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import { formatBrl, formatPercent } from '../utils/format'
import type { Procurement } from '../types'

export function MapaCompetitividade() {
  const [uf, setUf] = useState<string>('')
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchPncp({ q: 'serviço', tam_pagina: 50 }).then((items) => {
      setData(items)
      setLoading(false)
    })
  }, [])

  const rows = useMemo(() => {
    const grouped = new Map<string, { name: string; participations: number; wins: number; totalValue: number; uf: string }>()
    data.forEach((p) => {
      const key = p.orgao || p.portal || p.uf
      const g = grouped.get(key) || { name: key, uf: p.uf, participations: 0, wins: 0, totalValue: 0 }
      g.participations++
      if (p.status === 'homologado') g.wins++
      g.totalValue += p.valueBrl
      grouped.set(key, g)
    })

    return Array.from(grouped.values())
      .filter((r) => {
        if (uf && r.uf !== uf) return false
        return true
      })
      .sort((a, b) => b.participations - a.participations)
      .slice(0, 30)
      .map((r) => ({
        ...r,
        winRate: r.participations > 0 ? r.wins / r.participations : 0,
        avgTicket: r.participations > 0 ? r.totalValue / r.participations : 0,
      }))
  }, [data, uf])

  const ufs = useMemo(() => {
    return [...new Set(data.map((p) => p.uf).filter(Boolean))].sort()
  }, [data])

  const stats = useMemo(() => {
    const totalWins = rows.reduce((a, r) => a + r.wins, 0)
    return {
      totalOrgs: rows.length,
      avgWinRate: rows.length > 0 ? totalWins / rows.reduce((a, r) => a + r.participations, 0) : 0,
    }
  }, [rows])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-[var(--text)]">
          Mapa de Competitividade
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Órgãos e entidades com mais licitações na PNCP.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          UF
          <select
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
          >
            <option value="">Todas</option>
            {ufs.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Órgãos no recorte
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">{stats.totalOrgs}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Total de licitações
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">{data.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Taxa de homologação
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">
            {formatPercent(stats.avgWinRate * 100)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
          <thead className="bg-[var(--sidebar)] text-xs uppercase text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Órgão</th>
              <th className="px-4 py-3 font-medium">UF</th>
              <th className="px-4 py-3 font-medium tabular-nums">Licitações</th>
              <th className="px-4 py-3 font-medium tabular-nums">Homologadas</th>
              <th className="px-4 py-3 font-medium tabular-nums">Valor total</th>
              <th className="px-4 py-3 font-medium tabular-nums">Ticket médio</th>
              <th className="px-4 py-3 font-medium tabular-nums">Tx. homolog.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {rows.map((r) => (
              <tr key={r.name} className="hover:bg-[var(--surface-hover)]">
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text)]">{r.name}</div>
                </td>
                <td className="px-4 py-3 font-mono text-[var(--text)]">{r.uf}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--text)]">
                  {r.participations}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--text)]">
                  {r.wins}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--text)]">
                  {formatBrl(r.totalValue)}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--muted)]">
                  {formatBrl(r.avgTicket)}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--accent)]">
                  {formatPercent(r.winRate * 100)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">
            Nenhum dado encontrado.
          </p>
        ) : null}
      </div>
    </div>
  )
}
