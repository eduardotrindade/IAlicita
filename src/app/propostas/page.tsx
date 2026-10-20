'use client'

import { useState } from 'react'

export default function Propostas() {
  const [custos, setCustos] = useState({
    materiais: 0,
    maoObra: 0,
    equipamentos: 0,
    transporte: 0,
    administracao: 0,
    lucro: 0,
    tributos: 0,
  })

  const [bdi, setBdi] = useState(20)

  function update(field: string, value: string) {
    setCustos((prev) => ({ ...prev, [field]: +value || 0 }))
  }

  const custoTotal = Object.values(custos).reduce((s, v) => s + v, 0)
  const valorComBdi = custoTotal * (1 + bdi / 100)

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Propostas e BDI</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Planilha de composição de custos e cálculo de BDI.
        </p>
      </header>

      <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2">
        {Object.entries(custos).map(([key, value]) => (
          <label key={key} className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
            {key.charAt(0).toUpperCase() + key.slice(1)} (R$)
            <input
              type="number"
              value={value}
              onChange={(e) => update(key, e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
            />
          </label>
        ))}
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          BDI (%)
          <input
            type="number"
            value={bdi}
            onChange={(e) => setBdi(+e.target.value || 0)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Custo Total
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 2,
            }).format(custoTotal)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">BDI</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-[var(--accent)]">{bdi}%</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Valor da Proposta
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-green-400">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 2,
            }).format(valorComBdi)}
          </p>
        </div>
      </div>
    </div>
  )
}
