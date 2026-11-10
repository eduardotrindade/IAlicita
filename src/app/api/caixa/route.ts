import { type NextRequest, NextResponse } from 'next/server'
import { searchCaixaLicitacoes } from '@/lib/caixaLicitacoes'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || 'caixa'
    const items = await searchCaixaLicitacoes(q)

    return NextResponse.json({
      items,
      total: items.length,
      source: 'caixa-sicve-integration',
      portalUrl: 'https://licitacoes.caixa.gov.br/sicve-web/public/view/portal/portal.jsf',
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: `Erro ao integrar com licitações da Caixa: ${(err as Error)?.message}` },
      { status: 500 }
    )
  }
}
