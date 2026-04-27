import { useMemo, useState } from 'react'
import { MOCK_PROCUREMENTS, countByUf } from '../data/mockData'
import { formatBrl } from '../utils/format'
import { StatCard } from '../components/StatCard'
import { UfHeatStrip } from '../components/UfHeatStrip'
import { ProcurementCard } from '../components/ProcurementCard'

const RECENT = [...MOCK_PROCUREMENTS].sort(
  (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
)

export function Dashboard() {
  const [uf, setUf] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const base = RECENT.filter((p) => p.keywordsMatched.length > 0)
    if (!uf) return base
    return base.filter((p) => p.uf === uf)
  }, [uf])

  const totalValue = filtered.reduce((s, p) => s + p.valueBrl, 0)
  const counts = countByUf(filtered)
  const topUf = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-base font-semibold text-[var(--text)]">Dashboard</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Resumo das oportunidades aderentes às palavras-chave de TI e segurança
          (dados mock).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard label="Oportunidades (filtrado)" value={String(filtered.length)} />
          <StatCard
            label="Valor total estimado"
            value={formatBrl(totalValue)}
            hint={uf ? `Somente ${uf}` : 'Todas as UFs com match'}
          />
          <StatCard
            label="UF com mais oportunidades"
            value={topUf ? topUf[0] : '—'}
            hint={topUf ? `${topUf[1]} certame(s) neste recorte` : undefined}
          />
        </div>
      </section>

      <UfHeatStrip
        items={RECENT.filter((p) => p.keywordsMatched.length > 0)}
        selectedUf={uf}
        onSelectUf={setUf}
      />

      <section>
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Licitações recentes (palavras-chave)
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Use os botões WhatsApp e Telegram em cada card para enviar o resumo da
          oportunidade.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {filtered.slice(0, 6).map((p) => (
            <ProcurementCard key={p.id} procurement={p} showShare />
          ))}
        </div>
      </section>
    </div>
  )
}
