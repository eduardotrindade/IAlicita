import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function formatDateToIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const uf = (searchParams.get('uf') || '').toUpperCase()
    const pagina = searchParams.get('pagina') || '1'
    const rawTam = Number.parseInt(searchParams.get('tamanhoPagina') || '20', 10)
    const tamanhoPagina = Math.min(Math.max(Number.isFinite(rawTam) ? rawTam : 20, 10), 50)

    // Intervalo de datas: últimos 60 dias
    const now = new Date()
    const past = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const dataPublicacaoPncpFinal = formatDateToIso(now)
    const dataPublicacaoPncpInicial = formatDateToIso(past)

    const params = new URLSearchParams({
      dataPublicacaoPncpInicial,
      dataPublicacaoPncpFinal,
      codigoModalidade: '6', // Pregão
      pagina,
      tamanhoPagina: String(tamanhoPagina),
    })

    if (uf) {
      params.set('unidadeOrgaoUfSigla', uf)
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 9000)
    const url = `https://dadosabertos.compras.gov.br/modulo-contratacoes/1_consultarContratacoes_PNCP_14133?${params}`

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 IAlicita/1.0',
      },
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      console.warn(`Compras.gov error: ${res.status}`)
      return NextResponse.json({ items: [], total: 0 })
    }

    const data = await res.json()
    const rawList = Array.isArray(data.resultado) ? data.resultado : []

    let items = rawList.map((l: Record<string, any>) => ({
      id: l.numeroControlePNCP || l.idCompra,
      numeroControlePNCP: l.numeroControlePNCP,
      idCompra: l.idCompra,
      title: l.objetoCompra || l.modalidadeNome || 'Contratação Compras.gov',
      objeto: l.objetoCompra,
      description: l.objetoCompra || l.informacaoComplementar || '',
      portal: 'Compras.gov.br Oficial',
      uf: l.unidadeOrgaoUfSigla || uf || 'BR',
      city: l.unidadeOrgaoMunicipioNome || '',
      municipio: l.unidadeOrgaoMunicipioNome,
      valueBrl: Number(l.valorTotalEstimado || l.valorTotalHomologado || 0),
      valor: Number(l.valorTotalEstimado || 0),
      status:
        l.dataEncerramentoPropostaPncp && new Date(l.dataEncerramentoPropostaPncp) > new Date()
          ? 'aberto'
          : 'homologado',
      deadline: (l.dataEncerramentoPropostaPncp || l.dataPublicacaoPncp || '').split('T')[0],
      dataPublicacao: (l.dataPublicacaoPncp || '').split('T')[0],
      orgao: l.orgaoEntidadeRazaoSocial || 'Órgão Federal',
      orgaoNome: l.orgaoEntidadeRazaoSocial,
      unidade: l.unidadeOrgaoNomeUnidade,
      modalidade: l.modalidadeNome,
      amparoLegal: l.amparoLegalNome,
      link: l.idCompra
        ? `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/compras/acompanhamento-compra?compra=${l.idCompra}`
        : undefined,
    }))

    // Filtro por termo de busca se informado
    if (q && q.trim()) {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
      const filtered = items.filter((i: any) => {
        const text = `${i.title} ${i.description} ${i.orgao}`.toLowerCase()
        return terms.some((t: string) => text.includes(t))
      })
      if (filtered.length > 0) {
        items = filtered
      }
    }

    return NextResponse.json({
      items,
      total: data.totalRegistros || items.length,
      totalPaginas: data.totalPaginas || 1,
      source: 'compras-gov-live-api',
    })
  } catch (err) {
    console.warn('Compras.gov fetch failed:', (err as Error)?.message)
    return NextResponse.json({ items: [], total: 0 })
  }
}
