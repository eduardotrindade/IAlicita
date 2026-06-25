import { useCallback, useState } from 'react'

const KEY = 'ialicita-favoritos'

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

export function useFavoriteIds(): {
  favoriteIds: Set<string>
  toggle: (id: string) => void
  isFavorite: (id: string) => boolean
} {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(loadFavorites)

  const persist = useCallback((next: Set<string>) => {
    localStorage.setItem(KEY, JSON.stringify([...next]))
  }, [])

  const toggle = useCallback(
    (id: string) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  )

  return { favoriteIds, toggle, isFavorite }
}
