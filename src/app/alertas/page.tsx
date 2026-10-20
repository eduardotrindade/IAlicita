'use client'

import { useState } from 'react'
import { ProcurementCard } from '@/components/ProcurementCard'
import { searchPncp } from '@/lib/pncpApi'
import type { Procurement } from '@/types'

const STORAGE_KEY = 'ialicita-alertas-keywords'

function loadKeywords(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : ['engenharia', 'construção', 'escolas', 'saneamento']
  } catch {
    return ['engenharia', 'construção', 'escolas', 'saneamento']
  }
}

function saveKeywords(kw: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kw))
}

export default function Alertas() {
  const [keywords, setKeywords] = useState<string[]>(loadKeywords)
  const [newKw, setNewKw] = useState('')
  const [results, setResults] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(false)
  const [lastSearch, setLastSearch] = useState('')
  const addKeyword = () => {
    const kw = newKw.trim().toLowerCase()
    if (kw && !keywords.includes(kw)) {
      const next = [...keywords, kw]
      setKeywords(next)
      saveKeywords(next)
    }
    setNewKw('')
  }

  const removeKeyword = (kw: string) => {
    const next = keywords.filter((k) => k !== kw)
    setKeywords(next)
    saveKeywords(next)
  }

  const searchAll = async (kw?: string[]) => {
    const terms = kw || keywords
    if (terms.length === 0) return
    setLoading(true)
    setLastSearch(terms.join(', '))
    const query = terms.join(' ')
    try {
      const items = await searchPncp({ q: query, tam_pagina: 20 })
      setResults(items)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Alertas de Palavras-chave</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Busca automatizada na PNCP pelos termos configurados.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="flex items-center gap-1 rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
          >
            {kw}
            <button
              type="button"
              onClick={() => removeKeyword(kw)}
              className="ml-1 hover:text-red-400"
            >
              X
            </button>
          </span>
        ))}
        <input
          type="text"
          value={newKw}
          onChange={(e) => setNewKw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
          placeholder="Nova palavra-chave..."
          className="min-w-[10rem] flex-1 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        <button
          type="button"
          onClick={addKeyword}
          className="rounded bg-[var(--brand)] px-3 py-1 text-sm text-white hover:bg-[var(--brand-hover)]"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={() => searchAll()}
          disabled={loading}
          className="rounded bg-[var(--accent)] px-3 py-1 text-sm text-black disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar Agora'}
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse py-8 text-center text-sm text-[var(--muted)]">
          Buscando na PNCP...
        </div>
      ) : lastSearch ? (
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            Resultados para: <strong>{lastSearch}</strong>
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {results.map((p) => (
              <ProcurementCard key={p.id} procurement={p} showShare />
            ))}
            {results.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-[var(--muted)]">
                Nenhum resultado encontrado.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-[var(--muted)]">
          Adicione palavras-chave e clique em &quot;Buscar Agora&quot;.
        </p>
      )}
    </div>
  )
}
