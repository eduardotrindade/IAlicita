'use client'

import { useState } from 'react'
import { chatCompletion } from '@/lib/aiService'

export default function Tr() {
  const [formData, setFormData] = useState({
    orgao: '',
    objeto: '',
    especificacoes: '',
    quantidade: '',
    prazoEntrega: '',
    criterioAceitacao: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleGenerate() {
    setLoading(true)
    try {
      const prompt = `Com base na Lei 14.133/2021, gere um Termo de Referência (TR) completo e detalhado com:

Órgão: ${formData.orgao}
Objeto: ${formData.objeto}
Especificações Técnicas: ${formData.especificacoes}
Quantidade: ${formData.quantidade}
Prazo de Entrega: ${formData.prazoEntrega}
Critério de Aceitação: ${formData.criterioAceitacao}

Inclua: objeto, justificativa, especificações, obrigações das partes, condições de pagamento, sanções, e campo para assinatura.`

      const response = await chatCompletion([{ role: 'user', content: prompt }])
      setResult(response.content)
    } catch {
      setResult('Erro ao gerar TR. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">TR — Termo de Referência</h2>
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
          Quantidade
          <input
            type="text"
            value={formData.quantidade}
            onChange={(e) => update('quantidade', e.target.value)}
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
          Especificações Técnicas
          <textarea
            value={formData.especificacoes}
            onChange={(e) => update('especificacoes', e.target.value)}
            rows={3}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Prazo de Entrega
          <input
            type="text"
            value={formData.prazoEntrega}
            onChange={(e) => update('prazoEntrega', e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          Critério de Aceitação
          <input
            type="text"
            value={formData.criterioAceitacao}
            onChange={(e) => update('criterioAceitacao', e.target.value)}
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
        {loading ? 'Gerando...' : 'Gerar TR com IA'}
      </button>

      {result && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">TR Gerado</h3>
          <div className="whitespace-pre-wrap text-sm text-[var(--text)]">{result}</div>
        </div>
      )}
    </div>
  )
}
