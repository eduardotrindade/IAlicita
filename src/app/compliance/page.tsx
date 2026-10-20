'use client'

import { useState } from 'react'
import { lookupCnpj } from '@/lib/cnpjApi'
import type { CnpjData } from '@/types'

type ChecklistItem = {
  item: string
  status: 'ok' | 'warning' | 'error' | 'pending'
  detail: string
}

export default function Compliance() {
  const [cnpj, setCnpj] = useState('')
  const [company, setCompany] = useState<CnpjData | null>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(false)

  async function handleCheck() {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) return

    setLoading(true)
    setChecklist([])

    const data = await lookupCnpj(digits)
    setCompany(data)

    if (data) {
      const items: ChecklistItem[] = [
        {
          item: 'Situação Cadastral',
          status: data.situacao?.toLowerCase() === 'ativa' ? 'ok' : 'error',
          detail: data.situacao || 'Desconhecida',
        },
        {
          item: 'Porte (ME/EPP habilitado)',
          status: ['me', 'epp', 'micro empresa', 'empresa de pequeno porte'].some((p) =>
            data.porte?.toLowerCase().includes(p),
          )
            ? 'ok'
            : 'warning',
          detail: data.porte || 'Não informado',
        },
        {
          item: 'Atividade Principal Compatível',
          status: data.atividade_principal?.text ? 'ok' : 'warning',
          detail: data.atividade_principal?.text || 'Não informada',
        },
        {
          item: 'Endereço Válido',
          status: data.endereco.municipio ? 'ok' : 'error',
          detail: `${data.endereco.municipio || '—'}/${data.endereco.uf || '—'}`,
        },
        {
          item: 'QSA (Quadro Societário)',
          status: data.qsa && data.qsa.length > 0 ? 'ok' : 'warning',
          detail: data.qsa ? `${data.qsa.length} sócio(s)` : 'Não disponível',
        },
        {
          item: 'CNPJ Válido (14 dígitos)',
          status: data.cnpj?.length === 18 ? 'ok' : 'error',
          detail: `Formatado: ${data.cnpj}`,
        },
      ]
      setChecklist(items)
    }
    setLoading(false)
  }

  const statusIcon = {
    ok: '✅',
    warning: '⚠️',
    error: '❌',
    pending: '⏳',
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Compliance & LGPD</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Verificação de conformidade cadastral de fornecedores via CNPJ (ReceitaWS).
        </p>
      </header>

      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          CNPJ do fornecedor
          <input
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="00.000.000/0000-00"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading || cnpj.replace(/\D/g, '').length !== 14}
          className="self-end rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar Compliance'}
        </button>
      </div>

      {company && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">{company.nome}</h3>
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.item}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{statusIcon[item.status]}</span>
                    <span className="text-[var(--text)]">{item.item}</span>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
