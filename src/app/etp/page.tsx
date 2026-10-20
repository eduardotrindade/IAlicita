'use client'

import { useState } from 'react'
import { chatCompletion } from '@/lib/aiService'

export default function Etp() {
  const [formData, setFormData] = useState({
    orgao: '',
    objeto: '',
    modalidade: '',
    justificativa: '',
    valorReferencia: '',
    criterio: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleGenerate() {
    setLoading(true)
    try {
      const prompt = `Com base na Lei 14.133/2021, gere um Estudo Técnico Preliminar (ETP) completo com:

Órgão: ${formData.orgao}
Objeto da Contratação: ${formData.objeto}
Modalidade Pretendida: ${formData.modalidade}
Justificativa da Necessidade: ${formData.justificativa}
Valor de Referência: ${formData.valorReferencia}
Critério de Julgamento: ${formData.criterio}

Inclua: necessidade, requisitos, estimativa de valor, resultados esperados, e análise de riscos.`

      const response = await chatCompletion([{ role: 'user', content: prompt }])
      setResult(response.content)
    } catch {
      setResult('Erro ao gerar ETP. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">
          ETP — Estudo Técnico Preliminar
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
          Modalidade
          <input
            type="text"
            value={formData.modalidade}
            onChange={(e) => update('modalidade', e.target.value)}
            placeholder="Ex: Pregão, Concorrência..."
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
          Valor de Referência (R$)
          <input
            type="text"
            value={formData.valorReferencia}
            onChange={(e) => update('valorReferencia', e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Critério de Julgamento
          <input
            type="text"
            value={formData.criterio}
            onChange={(e) => update('criterio', e.target.value)}
            placeholder="Ex: Menor preço, Técnica e preço..."
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
        {loading ? 'Gerando...' : 'Gerar ETP com IA'}
      </button>

      {result && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">ETP Gerado</h3>
          <div className="whitespace-pre-wrap text-sm text-[var(--text)]">{result}</div>
        </div>
      )}
    </div>
  )
}
