'use client'

import { useState } from 'react'
import { chatCompletion } from '@/lib/aiService'

export default function AnalisadorEspecificacoes() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAnalyze() {
    if (!text.trim()) return
    setLoading(true)
    try {
      const prompt = `Analise a seguinte especificação técnica de uma licitação pública e forneça:
1. Pontos fortes
2. Pontos fracos / riscos
3. Sugestões de melhoria
4. Compliance com a Lei 14.133/2021

Especificação:
${text}`

      const response = await chatCompletion([{ role: 'user', content: prompt }])
      setAnalysis(response.content)
    } catch {
      setAnalysis('Erro ao analisar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">
          Analisador de Especificações Técnicas
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Cole o texto do Termo de Referência ou edital para análise com IA.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole aqui a especificação técnica..."
          rows={8}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="self-start rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? 'Analisando...' : 'Analisar com IA'}
        </button>
      </div>

      {analysis && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">Resultado da Análise</h3>
          <p className="whitespace-pre-wrap text-sm text-[var(--text)]">{analysis}</p>
        </div>
      )}
    </div>
  )
}
