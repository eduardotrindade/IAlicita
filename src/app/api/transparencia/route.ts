import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const pagina = searchParams.get('pagina') || '1'
    const apiKey = process.env.TRANSPARENCIA_API_KEY

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const url = `https://api.portaldatransparencia.gov.br/api-de-dados/licitacoes?palavraChave=${encodeURIComponent(q)}&pagina=${pagina}`
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (apiKey) headers['chave-api-dados'] = apiKey
    const res = await fetch(url, { headers, signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      console.warn(`Transparência error: ${res.status}`)
      return NextResponse.json({ items: [] })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.warn('Transparência fetch failed:', (err as Error)?.message)
    return NextResponse.json({ items: [] })
  }
}
