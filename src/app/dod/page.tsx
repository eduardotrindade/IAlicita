'use client'

import { useState } from 'react'
import { chatCompletion } from '@/lib/aiService'

export default function Dod() {
  const [formData, setFormData] = useState({
    orgao: '',
    objeto: '',
    justificativa: '',
    prazo: '',
    valorEstimado: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleGenerate() {
    setLoading(true)
    try {
      const prompt = `Com base na Lei 14.133/2021, gere um Documento de Oficialização de Demanda (DOD) completo e detalhado com as seguintes informações:

Órgão: ${formData.orgao}
Objeto: ${formData.objeto}
Justificativa: ${formData.justificativa}
Prazo: ${formData.prazo}
Valor Estimado: ${formData.valorEstimado}

Inclua: referência legal, descrição da necessidade, vinculação ao planejamento, estimativa de valor, e campo para assinatura.`

      const response = await chatCompletion([{ role: 'user', content: prompt }])
      setResult(response.content)
    } catch {
      setResult('Erro ao gerar DOD. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">
          DOD — Documento de Oficialização de Demanda
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Geração automatizada com IA baseada na Lei 14.133/2021.
        </p>
      </header>

      <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Órgão
          <input
            type="text"
            value={formData.orgao}
            onChange={(e) => update('orgao', e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Prazo desejado
          <input
            type="text"
            value={formData.prazo}
            onChange={(e) => update('prazo', e.target.value)}
            placeholder="Ex: 90 dias"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Objeto
          <textarea
            value={formData.objeto}
            onChange={(e) => update('objeto', e.target.value)}
            rows={3}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Justificativa
          <textarea
            value={formData.justificativa}
            onChange={(e) => update('justificativa', e.target.value)}
            rows={3}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Valor Estimado (R$)
          <input
            type="text"
            value={formData.valorEstimado}
            onChange={(e) => update('valorEstimado', e.target.value)}
            placeholder="Ex: 500.000"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
      >
        {loading ? 'Gerando...' : 'Gerar DOD com IA'}
      </button>

      {result && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">DOD Gerado</h3>
          <div className="whitespace-pre-wrap text-sm text-[var(--text)]">{result}</div>
        </div>
      )}
    </div>
  )
}
