import type { Procurement } from '../types'

export function countByUf(items: Procurement[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, p) => {
    const uf = p.uf || 'BR'
    acc[uf] = (acc[uf] ?? 0) + 1
    return acc
  }, {})
}
