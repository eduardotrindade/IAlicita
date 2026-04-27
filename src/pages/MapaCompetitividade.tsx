import { useMemo, useState } from 'react'
import { MOCK_SUPPLIERS } from '../data/mockData'
import { formatBrl, formatPercent } from '../utils/format'

export function MapaCompetitividade() {
  const [uf, setUf] = useState<string>('')
  const [onlyMeEpp, setOnlyMeEpp] = useState(false)
  const [minWinRate, setMinWinRate] = useState(0)

  const ufs = useMemo(() => {
    const s = new Set(MOCK_SUPPLIERS.map((x) => x.uf))
    return [...s].sort()
  }, [])

  const rows = useMemo(() => {
    return MOCK_SUPPLIERS.filter((s) => {
      if (uf && s.uf !== uf) return false
      if (onlyMeEpp && !s.isMicroOrSmall) return false
      if (s.winRate * 100 < minWinRate) return false
      return true
    }).sort((a, b) => b.participations - a.participations)
  }, [uf, onlyMeEpp, minWinRate])

  const stats = useMemo(() => {
    const me = rows.filter((r) => r.isMicroOrSmall)
    return {
      meCount: me.length,
      avgWinRate:
        rows.length === 0
          ? 0
          : rows.reduce((a, r) => a + r.winRate, 0) / rows.length,
    }
  }, [rows])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-[var(--text)]">
          Mapa de Competitividade
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Fornecedores que mais participam e vencem em licitações de TI /
          segurança — incluindo destaque para microempresas e EPP (dados
          simulados; integração futura com Portal da Transparência e PNCP).
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
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text)]">
          <input
            type="checkbox"
            checked={onlyMeEpp}
            onChange={(e) => setOnlyMeEpp(e.target.checked)}
            className="rounded border-[var(--border)]"
          />
          Somente ME / EPP
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Taxa de vitória mínima (%)
          <input
            type="number"
            min={0}
            max={100}
            value={minWinRate}
            onChange={(e) =>
              setMinWinRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))
            }
            className="w-24 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--text)]"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Fornecedores no recorte
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">{rows.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            ME / EPP listadas
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">{stats.meCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Taxa média de vitória
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
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">UF</th>
              <th className="px-4 py-3 font-medium">Perfil</th>
              <th className="px-4 py-3 font-medium tabular-nums">Particip.</th>
              <th className="px-4 py-3 font-medium tabular-nums">Vitórias</th>
              <th className="px-4 py-3 font-medium tabular-nums">Valor ganho</th>
              <th className="px-4 py-3 font-medium tabular-nums">Ticket médio</th>
              <th className="px-4 py-3 font-medium tabular-nums">Win rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--surface-hover)]">
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text)]">{s.companyName}</div>
                  <div className="font-mono text-[10px] text-[var(--muted)]">
                    CNPJ {s.cnpjMask}
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--muted)]">
                    Portais: {s.recentPortals.join(', ')}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[var(--text)]">{s.uf}</td>
                <td className="px-4 py-3">
                  {s.isMicroOrSmall ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      ME / EPP
                    </span>
                  ) : (
                    <span className="text-[var(--muted)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--text)]">
                  {s.participations}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--text)]">
                  {s.wins}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--text)]">
                  {formatBrl(s.totalWonValueBrl)}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--muted)]">
                  {formatBrl(s.avgTicketBrl)}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--accent)]">
                  {formatPercent(s.winRate * 100)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">
            Nenhum fornecedor atende aos filtros.
          </p>
        ) : null}
      </div>
    </div>
  )
}
