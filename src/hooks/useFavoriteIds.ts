import { useCallback, useEffect, useState } from 'react'

const KEY = 'smartia-favoritos'

export function useFavoriteIds(): {
  favoriteIds: Set<string>
  toggle: (id: string) => void
  isFavorite: (id: string) => boolean
} {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return
      const arr = JSON.parse(raw) as string[]
      setFavoriteIds(new Set(arr))
    } catch {
      /* ignore */
    }
  }, [])

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
