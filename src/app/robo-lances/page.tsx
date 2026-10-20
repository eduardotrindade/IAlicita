'use client'

import { useEffect, useState } from 'react'
import { formatBrl, formatDatePt } from '@/lib/format'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

interface RoboConfig {
  modalidades: string[]
  ufs: string[]
  valorMin: number
  valorMax: number
  intervaloSegundos: number
  ativo: boolean
}

export default function RoboLances() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<RoboConfig>({
    modalidades: ['Pregão'],
    ufs: [],
    valorMin: 0,
    valorMax: 10000000,
    intervaloSegundos: 60,
    ativo: false,
  })
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    const ctrl = new AbortController()
    searchPncp({ q: 'pregão', tam_pagina: 20 }, ctrl.signal)
      .then((items) => {
        if (!ctrl.signal.aborted) setData(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    if (!config.ativo) return
    const interval = setInterval(async () => {
      const items = await searchPncp({ q: 'pregão', tam_pagina: 10 })
      setData(items)
      const now = new Date().toLocaleTimeString('pt-BR')
      setLog((prev) =>
        [`[${now}] Busca automática: ${items.length} resultado(s)`, ...prev].slice(0, 50),
      )
    }, config.intervaloSegundos * 1000)
    return () => clearInterval(interval)
  }, [config.ativo, config.intervaloSegundos])

  const filtered = data.filter((p) => {
    if (
      config.modalidades.length > 0 &&
      !config.modalidades.some((m) => p.modalidade?.toLowerCase().includes(m.toLowerCase()))
    )
      return false
    if (config.ufs.length > 0 && !config.ufs.includes(p.uf)) return false
    if (p.valueBrl < config.valorMin || p.valueBrl > config.valorMax) return false
    return true
  })

  const toggleRobo = () => {
    setConfig((prev) => {
      const next = { ...prev, ativo: !prev.ativo }
      if (next.ativo) {
        const now = new Date().toLocaleTimeString('pt-BR')
        setLog((prevLog) => [
          `[${now}] Robô ativado (intervalo: ${next.intervaloSegundos}s)`,
          ...prevLog,
        ])
      } else {
        const now = new Date().toLocaleTimeString('pt-BR')
        setLog((prevLog) => [`[${now}] Robô desativado`, ...prevLog])
      }
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="animate-pulse text-sm text-[var(--muted)]">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Agente / Robô de Lances</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Busca automática recorrente na PNCP com filtros.
        </p>
      </header>

      <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Valor mínimo (R$)
          <input
            type="number"
            value={config.valorMin}
            onChange={(e) => setConfig((prev) => ({ ...prev, valorMin: +e.target.value }))}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Valor máximo (R$)
          <input
            type="number"
            value={config.valorMax}
            onChange={(e) => setConfig((prev) => ({ ...prev, valorMax: +e.target.value }))}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Intervalo (segundos)
          <input
            type="number"
            value={config.intervaloSegundos}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                intervaloSegundos: +e.target.value,
              }))
            }
            min={10}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={toggleRobo}
            className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              config.ativo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {config.ativo ? 'Parar Robô' : 'Iniciar Robô'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">
            Resultados ({filtered.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-xs"
              >
                <p className="font-medium text-[var(--text)]">{p.title}</p>
                <p className="mt-1 text-[var(--muted)]">
                  {p.orgao || p.portal} · {p.uf} · {formatBrl(p.valueBrl)} ·{' '}
                  {formatDatePt(p.deadline)}
                </p>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-4 text-center text-xs text-[var(--muted)]">
                Nenhum resultado com os filtros atuais.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">Log do Robô</h3>
          <div className="max-h-96 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
            {log.length === 0 ? (
              <p className="py-4 text-center text-xs text-[var(--muted)]">
                Nenhuma atividade ainda. Inicie o robô.
              </p>
            ) : (
              log.map((entry) => (
                <p key={entry} className="py-1 text-[10px] font-mono text-[var(--muted)]">
                  {entry}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
