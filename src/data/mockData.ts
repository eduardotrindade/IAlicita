import { searchPncp } from '../services/pncpApi'
import type { Procurement } from '../types'

export async function fetchProcurements(query = 'software', tamanho = 50): Promise<Procurement[]> {
  return searchPncp({ q: query, tam_pagina: tamanho })
}

export const SCORE_BANDS = [60, 70, 80, 90] as const

export function countByUf(items: Procurement[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, p) => {
    const uf = p.uf || 'BR'
    acc[uf] = (acc[uf] ?? 0) + 1
    return acc
  }, {})
}

export function procurementMatchesScore(p: Procurement, minScore: number): boolean {
  if (p.technicalScore == null) return true
  return p.technicalScore >= minScore
}
