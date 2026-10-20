/**
 * Cliente para a API do Portal da Transparência.
 * Fornece funções de health check e consulta de licitações.
 */

export async function healthCheckTransparencia(): Promise<boolean> {
  const res = await fetch('/api/transparencia?q=teste&pagina=1')
  if (!res.ok) throw new Error(`Transparência API error: ${res.status}`)
  return true
}

export async function searchTransparencia(
  q: string,
  pagina = 1,
): Promise<Record<string, unknown>[]> {
  const res = await fetch(`/api/transparencia?q=${encodeURIComponent(q)}&pagina=${pagina}`)
  if (!res.ok) throw new Error(`Transparência API error: ${res.status}`)
  const data = await res.json()
  return data.items || data || []
}
