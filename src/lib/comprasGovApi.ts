/**
 * Cliente para a API Dados Abertos do Compras.gov.br.
 * Fornece funções de health check e consulta de licitações reais.
 */

export async function healthCheckComprasGov(): Promise<boolean> {
  try {
    const res = await fetch('/api/compras-gov?pagina=1&tamanhoPagina=10')
    return res.ok
  } catch {
    return false
  }
}

export async function searchComprasGov(
  q = '',
  pagina = 1,
  uf = '',
): Promise<Record<string, unknown>[]> {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (pagina) params.set('pagina', String(pagina))
  if (uf) params.set('uf', uf)

  const res = await fetch(`/api/compras-gov?${params}`)
  if (!res.ok) throw new Error(`Compras.gov API error: ${res.status}`)
  const data = await res.json()
  return data.items || data._embedded?.licitacoes || []
}
