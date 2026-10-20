import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timeout)

    return NextResponse.json({
      url,
      status: res.status,
      ok: res.ok,
    })
  } catch (err) {
    const message = (err as Error)?.message || 'Erro desconhecido'
    return NextResponse.json({ error: message, ok: false }, { status: 502 })
  }
}
