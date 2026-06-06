import { useState, useEffect } from 'react'
import { searchPncp } from '../services/pncpApi'
import type { Procurement } from '../types'

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Tecnologia da Informação': ['software', 'sistema', 'computador', 'servidor', 'storage', 'firewall', 'rede', 'ti', 'tic', 'tecnologia', 'informática', 'digital'],
  'Saúde': ['saúde', 'hospital', 'medicamento', 'médico', 'ambulatório', 'farmácia', 'clínico'],
  'Obras e Engenharia': ['obra', 'engenharia', 'construção', 'reforma', 'pavimentação', 'estrada', 'edificação'],
  'Educação': ['educação', 'escola', 'universidade', 'ensino', 'treinamento', 'capacitação', 'curso'],
  'Transporte': ['transporte', 'veículo', 'frota', 'ônibus', 'caminhão', 'logística'],
  'Segurança': ['segurança', 'vigilância', 'monitoramento', 'câmera', 'alarme', 'patrulha'],
}

function classifyProcurement(p: Procurement): string {
  const text = `${p.title} ${p.keywordsMatched.join(' ')} ${p.orgao || ''}`.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) return cat
  }
  return 'Outros'
}

function getConfidence(p: Procurement): number {
  const text = `${p.title} ${p.keywordsMatched.join(' ')} ${p.orgao || ''}`.toLowerCase()
  const cat = classifyProcurement(p)
  if (cat === 'Outros') return 65
  const matched = CATEGORY_KEYWORDS[cat]?.filter((k) => text.includes(k)).length || 0
  const total = CATEGORY_KEYWORDS[cat]?.length || 1
  return Math.min(99, 75 + Math.round((matched / total) * 24))
}

export function ClassificacaoIA() {
  const [data, setData] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchPncp({ q: 'serviço', tam_pagina: 20 }).then((items) => {
      setData(items)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Classificação com IA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Rotulação automática em categorias baseada no título e descrição.
        </p>
      </header>
      <div className="grid gap-4">
        {data.slice(0, 10).map((p) => {
          const cat = classifyProcurement(p)
          const conf = getConfidence(p)
          return (
            <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[var(--text)] truncate">{p.title}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{p.orgao || p.portal} • {p.uf}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 text-xs font-semibold">
                  {cat}
                </span>
                <span className="rounded-full bg-[var(--surface-hover)] border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                  Confiança: {conf}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
