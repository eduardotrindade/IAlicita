'use client'

import { useEffect, useState } from 'react'
import { chatCompletion } from '@/lib/aiService'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

export default function ClassificacaoIA() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [classifying, setClassifying] = useState(false)
  const [classifications, setClassifications] = useState<
    Record<string, { category: string; confidence: number }>
  >({})

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    searchPncp({ q: 'serviço', tam_pagina: 10 }, ctrl.signal)
      .then((items) => {
        if (!ctrl.signal.aborted) {
          setData(items)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  const classifyAll = async () => {
    setClassifying(true)
    const results: Record<string, { category: string; confidence: number }> = {}

    for (const p of data) {
      try {
        const prompt = `Classifique a seguinte licitação em uma das categorias: Tecnologia da Informação, Saúde, Obras e Engenharia, Educação, Transporte, Segurança, ou Outros. Responda APENAS com o nome da categoria e o nível de confiança (0-100) no formato: Categoria|Confiança.

Título: ${p.title}
Órgão: ${p.orgao || 'N/A'}
Modalidade: ${p.modalidade || 'N/A'}
Palavras-chave: ${p.keywordsMatched.join(', ')}`

        const response = await chatCompletion([{ role: 'user', content: prompt }])
        const parts = response.content.split('|')
        const category = parts[0]?.trim() || 'Outros'
        const confidence = Math.min(99, Math.max(50, Number(parts[1]?.trim()) || 75))
        results[p.id] = { category, confidence }
      } catch {
        results[p.id] = { category: 'Outros', confidence: 50 }
      }
    }

    setClassifications(results)
    setClassifying(false)
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
        <h2 className="text-base font-semibold text-[var(--text)]">Classificação com IA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Classificação automática via IA (SiliconFlow / AIML / HuggingFace) em categorias de
          negócio.
        </p>
      </header>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={classifyAll}
          disabled={classifying || data.length === 0}
          className="rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {classifying ? 'Classificando...' : `Classificar ${data.length} licitações com IA`}
        </button>
        {classifying && (
          <span className="animate-pulse text-xs text-[var(--muted)]">
            Consultando IA para cada item...
          </span>
        )}
      </div>

      <div className="grid gap-4">
        {data.map((p) => {
          const cls = classifications[p.id]
          return (
            <div
              key={p.id}
              className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text)]">{p.title}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {p.orgao || p.portal} · {p.uf}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {cls ? (
                  <>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      {cls.category}
                    </span>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1 text-xs font-semibold">
                      Confiança: {cls.confidence}%
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-[var(--muted)]">Aguardando classificação...</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
